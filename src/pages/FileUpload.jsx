import { FileText, X } from "lucide-react";
import React from "react";

function FileUpload() {
  const isFileUploaded = false;
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Upload File</h2>
          <button className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        {/* Upload area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-blue-50 min-h-[200px] flex flex-col items-center justify-center ">
          <div className="mb-4">
            <FileText size={48} className="text-blue-600" />
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Drag and Drop file here or{" "}
              <span className="text-blue-600 cursor-pointer hover:text-blue-700">
                Chose file
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, DOC, DOCX, PPT, PPTX
            </p>
            <p className="text-sm text-gray-500 mt-1">Maximum size: 25MB</p>
          </div>
        </div>
        <div className="mt-4 bg-gray-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <FileText size={24} className="text-gray-600" />
            <div>
              <p className="text-sm font-medium">Document Example</p>
              <p className="text-xs text-gray-500">
                You can download the attached example and use it as a starting
                point.
              </p>
            </div>
            <button className="ml-auto text-sm text-blue-600 hover:text-blue-700">
              Download
            </button>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm text-white rounded-lg bg-gray-400 cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
