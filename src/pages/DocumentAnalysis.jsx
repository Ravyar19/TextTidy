import { FileText } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Book, Brain, MessageSquare, Search, List } from "lucide-react";
import { useFile } from "../Context/FileContext";

function DocumentAnalysis() {
  const [selectedTool, setSelectedTool] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { file } = useFile();

  const tools = [
    {
      id: "summary",
      icon: Book,
      title: "Lecture Summary",
      description: "Get a concise overview of key points",
      path: "/analysis/summary",
    },
    {
      id: "quiz",
      icon: Brain,
      title: "Quiz Generator",
      description: "Create practice questions from content",
      path: "/analysis/quiz",
    },
    {
      id: "chat",
      icon: MessageSquare,
      title: "Ask Questions",
      description: "Chat with your document",
      path: "/analysis/chat",
    },
    {
      id: "search",
      icon: Search,
      title: "Smart Search",
      description: "Find specific information quickly",
      path: "/analysis/search",
    },
    {
      id: "concepts",
      icon: List,
      title: "Key Concepts",
      description: "Extract main ideas and terms",
      path: "/analysis/concepts",
    },
  ];

  const handleAnalyze = () => {
    if (!selectedTool) return;

    const tool = tools.find((t) => t.id === selectedTool);
    if (tool) {
      navigate(tool.path, {
        state: {
          file,
          from: location.pathname,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="font-medium">{file?.name}</h2>
              <p className="text-sm text-gray-500">
                {(file?.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={` p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all ${
                selectedTool === tool.id ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <tool.icon className="" />
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
            </button>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={!selectedTool}
            className={`
              px-6 py-3 rounded-lg text-white font-medium
              ${
                selectedTool
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }
            `}
          >
            Analyze Document
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocumentAnalysis;
