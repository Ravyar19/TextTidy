import { AlertCircle, Book, FileText, List, Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Summary() {
  const location = useLocation();
  const file = location.state?.file;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  const [summary, setSummary] = useState(null);
  const [keyPoints, setKeyPoints] = useState([]);

  useEffect(() => {
    const readFile = async () => {
      if (!file) return;

      try {
        const reader = new FileReader();

        reader.onload = async (e) => {
          if (file.type === "application/pdf") {
            const pdfData = new Uint8Array(e.target.result);
            const pdfjsLib = window.pdfjsLib;
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

            try {
              const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
              let fullText = "";

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
            setFileContent(e.target.result);
          }
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          setError("Failed to read the file");
        };

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

  const generateSummary = async () => {
    setLoading(true);
    setError(null);

    if (!fileContent) {
      setError("No file content found");
      setLoading(false);
      return;
    }

    try {
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
                  "You are a helpful assistant that creates concise lecture summaries. Return only valid JSON without any additional text. ",
              },
              {
                role: "user",
                content: `Create a summary of this lecture content and extract key points. Content: ${fileContent.slice(
                  0,
                  6000
                )}
                    
                    return a JSON object with:
                    {
                    "summary:"A concise 2-3 paragraph summary",
                    "keyPoints:["Array of 5-7 key points form the lecture"]
                    }
                    `,
              },
            ],
            temperature: 0.3,
            response_format: { type: "json_object" },
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "failed to generate summary"
        );
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      setSummary(result.summary);
      setKeyPoints(result.keyPoints);
    } catch (error) {
      console.error("Error generating summary", error);
      setError(
        error.message || "An error occurred while generating the summary"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto  px-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex items-center space-x-3">
            <Book className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="font-medium">{file?.name}</h2>
              <p className="text-sm text-gray-500">
                {" "}
                {(file?.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div>
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      )}

      {!loading && !summary && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-6 space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Generate Lecture Summary</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Generate a concise summary of your lecture content along with key
            points to remember
          </p>
          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={generateSummary}
          >
            Generate Summary
          </button>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center justify-center">
            <Loader className="w-8 h-8 text-blue-600 animate-spin mb-4" />
            <p>Generating your summary</p>
          </div>
        </div>
      )}
      {!loading && summary && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4 space-x-2">
              <Book className="w-5 h-5 text-blue-600" />
              <h2 className=" text-xl font-semibold ">Lecture Summary</h2>
            </div>
            <div className="prose max-w-none">
              <p className=" text-gray-800 whitespace-pre-line ">{summary}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4 space-x-2">
              <List className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Key Points</h2>
            </div>
            <ul className="space-y-3">
              {keyPoints.map((point, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <p className="text-gray-800">{point}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end">
            <button
              className="px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => {
                setSummary(null);
                setKeyPoints([]);
              }}
            >
              Generate New Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Summary;
