import { Book, Loader, Settings } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

function QuizGenerator() {
  const location = useLocation();
  const file = location.state?.file;

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

  const generateQuiz = () => {
    setCurrentStep("generating");
    // Here we'll add the API integration later
    setTimeout(() => {
      setCurrentStep("quiz");
      // Temporary mock questions
      setQuestions([
        {
          id: 1,
          question: "Sample question 1?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 0,
        },
      ]);
    }, 2000);
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
              <div>
                <h3 className="text-xl font-semibold mb-6">Quiz Results</h3>
                {/* Results UI will be implemented later */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizGenerator;
