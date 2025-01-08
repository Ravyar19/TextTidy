import { FileText, X } from "lucide-react";
import React, { useState } from "react";

function FileUpload() {
  const [file, setFile] = useState(null);
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

  const clearFile = () => {
    setFile(null);
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Upload File</h2>
          <button
            onClick={clearFile}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        {/* Upload area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8
            ${
              dragActive
                ? "border-blue-500 bg-blue-100"
                : "border-gray-300 bg-blue-50"
            }
            min-h-[200px] flex flex-col items-center justify-center
            transition-colors duration-200
          `}
        >
          {/* Hidden file input */}
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            className="hidden"
            id="file-upload"
          />

          {!file ? (
            // Show upload prompt when no file is selected
            <>
              <div className="mb-4">
                <FileText size={48} className="text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  Drag and Drop file here or{" "}
                  <label
                    htmlFor="file-upload"
                    className="text-blue-600 cursor-pointer hover:text-blue-700"
                  >
                    Choose file
                  </label>
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, DOC, DOCX, PPT, PPTX
                </p>
                <p className="text-sm text-gray-500 mt-1">Maximum size: 25MB</p>
              </div>
            </>
          ) : (
            // Show file information when a file is selected
            <div className="text-center">
              <div className="mb-3">
                <FileText size={48} className="text-blue-600 mx-auto" />
              </div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
        <div className="mt-4">
          {file && (
            <div className="bg-white border rounded-lg mb-4 p-4">
              <div className="flex items-center space-x-3">
                <div className="text-blue-600">
                  <FileText size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-blue-600 font-medium">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button className="text-sm text-gray-700 hover:text-gray-900">
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            onClick={clearFile}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 text-sm text-white rounded-lg
              ${
                file
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            disabled={!file}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
