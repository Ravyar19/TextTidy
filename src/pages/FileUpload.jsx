import { FileText, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFile } from "../Context/FileContext";
import { motion } from "framer-motion";

function FileUpload() {
  const navigate = useNavigate();
  const { file, setFile } = useFile();

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      console.log("Dropped file:", droppedFile.name);
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log("Selected file:", selectedFile.name);
      setFile(selectedFile);
    }
  };

  const handleNext = () => {
    if (file) {
      navigate("/analysis", { state: { file } });
    }
  };

  const clearFile = () => {
    setFile(null);
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.05) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-200 via-violet-200 to-purple-200 rounded-full blur-3xl opacity-20" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-violet-200 via-purple-200 to-pink-200 rounded-full blur-3xl opacity-20" />

      <div className="relative min-h-screen w-full flex items-center justify-center px-6">
        <motion.div
          className="w-full max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-3">
              Upload your document
            </h1>
            <p className="text-slate-600">
              Drag and drop file to begin analysis
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/60 rounded-2xl p-8 shadow-lg border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-purple-500/5" />
            <div
              className={`
                relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ease-in-out ${
                  dragActive
                    ? "border-violet-400 bg-violet-50/50"
                    : "border-slate-300 hover:border-violet-300 bg-white/30"
                }
                `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                className="hidden"
                id="file-upload"
              />

              {!file ? (
                <div className="flex flex-col items-center justify-center">
                  <motion.div
                    className="mb-6"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <div className="bg-gradient-to-br from-violet-500 to-purple-500 p-4 rounded-xl shadow-lg">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                  <div className="text-center">
                    <p className="text-slate-700 mb-2">
                      Drag and drop file here or{" "}
                      <label
                        htmlFor="file-upload"
                        className="text-violet-600 font-medium cursor-pointer hover:text-violet-700 transition-colors"
                      >
                        Choose file
                      </label>
                    </p>
                    <p className="text-sm text-slate-500">
                      Supported formats: PDF, DOC, DOCX, PPT, PPTX
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Maximum size: 25MB
                    </p>
                  </div>
                </div>
              ) : (
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="mb-4">
                    <div className="bg-gradient-to-br from-violet-500 to-purple-500 p-4 rounded-xl shadow-lg inline-block">
                      <FileText className="text-white w-8 h-8" />
                    </div>
                  </div>
                  <p>{file?.name}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </motion.div>
              )}
            </div>
            {file && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-white/80 rounded-xl p-4 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-violet-500 to-purple-500 p-2 rounded-xl ">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 font-medium">{file.name}</p>
                    <p className="text-sm text-slate-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={clearFile}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </motion.div>
            )}
            <div className="flex justify-end space-x-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="relative px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors font-medium z-10"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                disabled={!file}
                className={`
                  relative px-6 py-2 rounded-lg font-medium
                  overflow-hidden transition-all duration-300
                  ${
                    file
                      ? "text-white shadow-lg cursor-pointer"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }
                `}
              >
                {file && (
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 animate-gradient" />
                )}
                <span className="relative">Continue</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default FileUpload;
