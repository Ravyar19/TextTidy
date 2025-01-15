import { AlertCircle, Book, Loader, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useFile } from "../Context/FileContext";

const ScoreDisplay = ({ questions, userAnswers }) => {
  const totalQuestions = questions.length;
  const correctAnswers = questions.filter(
    (q) => userAnswers[q.id] === q.correctAnswer
  ).length;
  const score = (correctAnswers / totalQuestions) * 100;

  return (
    <div>
      <div className="text-4xl font-bold text-blue-600 mb-2">
        {score.toFixed(0)}%
      </div>
      <p className="text-gray-600">
        You got {correctAnswers} out of {totalQuestions} questions correct
      </p>
    </div>
  );
};

function QuizGenerator() {
  const { file } = useFile();

  const [quizSettings, setQuizSettings] = useState({
    numberOfQuestions: 5,
    questionType: "multiple-choice",
    topics: [], // Will be populated based on document analysis
  });

  const [currentStep, setCurrentStep] = useState("settings"); // settings, generating, quiz
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleSettingsChange = (setting, value) => {
    setQuizSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const [error, setError] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  useEffect(() => {
    const readFile = async () => {
      if (!file) return;

      try {
        // For PDFs, we need to get the raw data first
        const reader = new FileReader();

        reader.onload = async (e) => {
          // If it's a PDF
          if (file.type === "application/pdf") {
            const pdfData = new Uint8Array(e.target.result);
            const pdfjsLib = window.pdfjsLib;
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

            try {
              const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
              let fullText = "";

              // Get all pages text
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const textItems = textContent.items.map((item) => item.str);
                fullText += textItems.join(" ") + "\n";
              }

              setFileContent(fullText);
            } catch (pdfError) {
              console.error("Error parsing PDF:", pdfError);
              setError("Failed to read PDF content");
            }
          } else {
            // For non-PDF files, use text content directly
            setFileContent(e.target.result);
          }
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          setError("Failed to read the file");
        };

        // Read as array buffer for PDFs, as text for others
        if (file.type === "application/pdf") {
          reader.readAsArrayBuffer(file);
        } else {
          reader.readAsText(file);
        }
      } catch (error) {
        console.error("Error reading file", error);
        setError("An error occurred while reading the file");
      }
    };
    readFile();
  }, [file]);

  // Update this part in the generatePrompt function
  const generatePrompt = (content, settings) => {
    return `Create ${settings.numberOfQuestions} ${
      settings.questionType
    } questions based on this content: 

  ${content.slice(0, 6000)}

  Return a JSON object with a "questions" array. Each question object should have:
  {
    "question": "The question text",
    "options": ["option1", "option2", "option3", "option4"], // For multiple choice
    "correctAnswer": 0, // Index of correct option (0-based)
    "explanation": "Brief explanation of why this answer is correct"
  }

  For true/false questions, provide only two options: ["True", "False"].
  Focus on key concepts and important details from the content.
  Make questions clear and unambiguous.
  Ensure all options are plausible but only one is correct.`;
  };
  const generateQuiz = async () => {
    setCurrentStep("generating");
    setError(null);

    if (!fileContent) {
      setError("No file content found");
      setCurrentStep("settings");
      return;
    }
    try {
      const prompt = generatePrompt(fileContent, quizSettings);
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo-0125",
            messages: [
              {
                role: "system",
                content:
                  "You are a quiz generator. Generate questions based on the provided content. Return only valid JSON without any additional text or explanation. ",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.3,
            response_format: { type: "json_object" },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData); // This will help debug the issue
        throw new Error(errorData.error?.message || "Failed to generate quiz");
      }

      const data = await response.json();
      const generatedQuestions = data.choices[0].message.content;
      const parsedQuestions = JSON.parse(generatedQuestions).questions;

      setQuestions(
        parsedQuestions.map((q, index) => ({
          ...q,
          id: index + 1,
        }))
      );
      setCurrentStep("quiz");
    } catch (error) {
      console.error("Error generating quiz:", error);
      setError(error.message || "An error occurred while generating the quiz");
      setCurrentStep("settings");
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex items-center space-x-3">
            <Book className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="font-medium">{file?.name}</h2>
              <p className="text-sm text-gray-500">
                {(file?.size / (1024 * 1021)).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        {currentStep === "settings" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex  items-center mb-6 space-x-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Quiz Settings</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <input
                  type="number"
                  min="1"
                  max="2"
                  value={quizSettings.numberOfQuestions}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) =>
                    handleSettingsChange("numberOfQuestions", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={quizSettings.questionType}
                  onChange={(e) =>
                    handleSettingsChange("questionType", e.target.value)
                  }
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                  <option value="short-answer">Short Answer</option>
                </select>
              </div>
              <button
                onClick={generateQuiz}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Quiz
              </button>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}
        {currentStep === "generating" && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col items-center justify-center">
              <Loader className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p>Generating your quiz...</p>
            </div>
          </div>
        )}
        {currentStep === "quiz" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            {!showResults ? (
              <div>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {Math.round(
                        ((currentQuestionIndex + 1) / questions.length) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((currentQuestionIndex + 1) / questions.length) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="mb-8">
                  <h4 className="text-lg mb-4">
                    {questions[currentQuestionIndex].question}
                  </h4>
                  <div className="space-y-3">
                    {questions[currentQuestionIndex].options.map(
                      (option, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            handleAnswerSelect(
                              questions[currentQuestionIndex].id,
                              idx
                            )
                          }
                          className={`w-full p-4 text-left rounded-lg border transition-colors
                          ${
                            userAnswers[questions[currentQuestionIndex].id] ===
                            idx
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-500"
                          }
                        `}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentQuestionIndex === 0}
                    className="px-6 py-2 rounded-lg border border-gray-200 hover:border-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      if (currentQuestionIndex < questions.length - 1) {
                        setCurrentQuestionIndex((prev) => prev + 1);
                      } else {
                        setShowResults(true);
                      }
                    }}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {currentQuestionIndex === questions.length - 1
                      ? "Finish"
                      : "Next"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Score Display */}
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-2xl font-semibold mb-4">Quiz Results</h3>
                  <ScoreDisplay
                    questions={questions}
                    userAnswers={userAnswers}
                  />
                </div>

                {/* Question Review */}
                <div className="space-y-6">
                  <h4 className="text-xl font-medium">Question Review</h4>
                  {questions.map((question) => (
                    <div
                      key={question.id}
                      className={`p-6 rounded-lg border ${
                        userAnswers[question.id] === question.correctAnswer
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium">Question {question.id}</h5>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            userAnswers[question.id] === question.correctAnswer
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {userAnswers[question.id] === question.correctAnswer
                            ? "Correct"
                            : "Incorrect"}
                        </span>
                      </div>

                      <p className="mb-4">{question.question}</p>

                      <div className="space-y-2 mb-4">
                        {question.options.map((option, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded ${
                              idx === question.correctAnswer
                                ? "bg-green-100 border border-green-200"
                                : idx === userAnswers[question.id]
                                ? "bg-red-100 border border-red-200"
                                : "bg-gray-50 border border-gray-200"
                            }`}
                          >
                            {option}
                            {idx === question.correctAnswer && (
                              <span className="ml-2 text-green-600 text-sm">
                                (Correct Answer)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {question.explanation && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Explanation: </span>
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-6">
                  <button
                    onClick={() => {
                      setCurrentQuestionIndex(0);
                      setUserAnswers({});
                      setShowResults(false);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => {
                      setCurrentStep("settings");
                      setShowResults(false);
                      setUserAnswers({});
                      setQuestions([]);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    New Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizGenerator;
