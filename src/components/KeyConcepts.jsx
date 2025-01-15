import {
  AlertCircle,
  ArrowRight,
  Book,
  BookOpen,
  Loader,
  Network,
  Tag,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFile } from "../Context/FileContext";

function KeyConcepts() {
  const { file } = useFile();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState("concepts");

  useEffect(() => {
    const readFile = async () => {
      if (!file) {
        navigate("/upload");
        return;
      }

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
        console.error("Error reading file:", error);
        setError("An error occurred while reading the file");
      }
    };

    readFile();
  }, [file, navigate]);

  const analyzeDocument = async () => {
    if (!fileContent || loading) return;

    setLoading(true);
    setError(null);

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
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are an expert at analyzing documents and extracting key concepts and terms. Return only valid JSON.",
              },
              {
                role: "user",
                content: `Analyze this document and extract key concepts, important terms, and their relationships. Document content: ${fileContent?.slice(
                  0,
                  6000
                )}

              Return as JSON in this format:
              {
                "mainConcepts": [
                  {
                    "concept": "Name of the concept",
                    "description": "Brief explanation",
                    "importance": "Why this concept is key to understanding the document"
                  }
                ],
                "terms": [
                  {
                    "term": "Technical or important term",
                    "definition": "Clear definition",
                    "context": "How it's used in the document"
                  }
                ],
                "relationships": [
                  {
                    "concept1": "First concept",
                    "concept2": "Related concept",
                    "relationship": "Description of how they are related"
                  }
                ]
              }`,
              },
            ],
            temperature: 0.3,
            response_format: { type: "json_object" },
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to analyze document");
      }

      const data = await response.json();
      const results = JSON.parse(data.choices[0].message.content);
      setAnalysis(results);
    } catch {
      console.error("Error analyzing document:", error);
      setError("Failed to analyze the document");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fileContent && !analysis) {
      analyzeDocument();
    }
  }, [fileContent]);

  const renderMainConcepts = () => (
    <div className="space-y-6">
      {analysis?.mainConcepts.map((concept, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
        >
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {concept.concept}
              </h3>
              <p className="text-gray-600 mb-3">{concept.description}</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">{concept.importance}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTerms = () => (
    <div className="space-y-4">
      {analysis?.terms.map((term, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
        >
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Tag className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{term.term}</h4>
              <p className="text-gray-600 mt-1">{term.definition}</p>
              <div className="bg-gray-50 p-2 rounded-lg mt-2">
                <p className="text-sm text-gray-600">{term.context}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRelationships = () => (
    <div className="space-y-4">
      {analysis?.relationships.map((rel, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
        >
          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Network className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-gray-900">
                  {rel.concept1}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">
                  {rel.concept2}
                </span>
              </div>
              <p className="text-gray-600">{rel.relationship}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex items-center space-x-3">
            <Book className="w-6 text-blue-600  h-6" />
            <div>
              <h2 className="font-medium">{file?.name}</h2>
              <p className="text-sm text-gray-500">
                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "N/A"}
              </p>
            </div>
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col items-center justify-center">
              <Loader className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Analyzing document...</p>
            </div>
          </div>
        )}

        {!loading && analysis && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b">
              <div className=" flex space-x-1 p-2">
                <button
                  onClick={() => setActiveTab("concepts")}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === "concepts"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Main Concepts
                </button>
                <button
                  onClick={() => setActiveTab("terms")}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === "terms"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Important Terms
                </button>
                <button
                  onClick={() => setActiveTab("relationships")}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === "relationships"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Relationships
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === "concepts" && renderMainConcepts()}
              {activeTab === "terms" && renderTerms()}
              {activeTab === "relationships" && renderRelationships()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default KeyConcepts;
