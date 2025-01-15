import { FileText } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Book, Brain, MessageSquare, Search, List } from "lucide-react";
import { useFile } from "../Context/FileContext";
import { motion } from "framer-motion";

function DocumentAnalysis() {
  const [selectedTool, setSelectedTool] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredTool, setHoveredTool] = useState(null);

  const { file } = useFile();

  const tools = [
    {
      id: "summary",
      icon: Book,
      title: "Lecture Summary",
      description: "Get a concise overview of key points",
      path: "/analysis/summary",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      id: "quiz",
      icon: Brain,
      title: "Quiz Generator",
      description: "Create practice questions from content",
      path: "/analysis/quiz",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "chat",
      icon: MessageSquare,
      title: "Ask Questions",
      description: "Chat with your document",
      path: "/analysis/chat",
      gradient: "from-teal-500 to-emerald-500",
    },
    {
      id: "search",
      icon: Search,
      title: "Smart Search",
      description: "Find specific information quickly",
      path: "/analysis/search",
      gradient: "from-rose-500 to-pink-500",
    },
    {
      id: "concepts",
      icon: List,
      title: "Key Concepts",
      description: "Extract main ideas and terms",
      path: "/analysis/concepts",
      gradient: "from-amber-500 to-orange-500",
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

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Creative background pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.05) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Header with creative elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 relative"
        >
          <div className="absolute -left-4 -top-4 w-20 h-20 bg-gradient-to-br from-violet-200 to-fuchsia-200 rounded-full blur-2xl opacity-60" />
          <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-40" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-3">
            Document Analysis
          </h1>
          <p className="text-slate-600 text-lg">
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </motion.div>

        {/* File Status Card with glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 mb-12 shadow-lg border border-white/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-purple-500/5" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-4 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {file?.name}
                </h2>
                <p className="text-slate-600">
                  {(file?.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse" />
              <span className="text-slate-700 font-medium">
                Ready for analysis
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tools Grid with hover effects */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {tools.map((tool, index) => (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: index * 0.1 },
              }}
              onHoverStart={() => setHoveredTool(tool.id)}
              onHoverEnd={() => setHoveredTool(null)}
              onClick={() => setSelectedTool(tool.id)}
              className={`
                relative p-6 rounded-2xl transition-all duration-300
                ${
                  selectedTool === tool.id
                    ? "bg-white shadow-xl scale-[1.02]"
                    : "bg-white/60 backdrop-blur-lg hover:shadow-lg hover:scale-[1.02]"
                }
              `}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-10" />
              <div className="relative flex flex-col items-center text-center">
                <div
                  className={`
                  p-4 rounded-xl mb-4 transition-all duration-300
                  ${
                    selectedTool === tool.id || hoveredTool === tool.id
                      ? `bg-gradient-to-br ${tool.gradient} shadow-lg`
                      : "bg-slate-100"
                  }
                `}
                >
                  <tool.icon
                    className={`
                    w-6 h-6 transition-colors
                    ${
                      selectedTool === tool.id || hoveredTool === tool.id
                        ? "text-white"
                        : "text-slate-600"
                    }
                  `}
                  />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {tool.title}
                </h3>
                <p className="text-slate-600">{tool.description}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Action Button with gradient animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            disabled={!selectedTool}
            className={`
              relative px-8 py-4 rounded-xl font-semibold text-lg
              transition-all duration-300 overflow-hidden
              ${
                selectedTool
                  ? "text-white shadow-lg"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }
            `}
          >
            {selectedTool && (
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 animate-gradient" />
            )}
            <span className="relative">Analyze Document</span>
          </motion.button>
        </motion.div>

        {/* Decorative background elements */}
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-200 via-violet-200 to-purple-200 rounded-full blur-3xl opacity-20 -z-10" />
        <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 rounded-full blur-3xl opacity-20 -z-10" />
      </div>
    </div>
  );
}

export default DocumentAnalysis;
