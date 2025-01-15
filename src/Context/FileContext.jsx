import { createContext, useContext, useState, useEffect } from "react";

const FileContext = createContext();

export function FileProvider({ children }) {
  const [file, setFile] = useState(null);

  useEffect(() => {
    const savedFileData = sessionStorage.getItem("fileData");
    if (savedFileData) {
      try {
        const parsedData = JSON.parse(savedFileData);
        const recoveredFile = new File(
          [base64ToBlob(parsedData.data, parsedData.type)],
          parsedData.name,
          {
            type: parsedData.type,
            lastModified: parsedData.lastModified,
          }
        );
        setFile(recoveredFile);
      } catch (error) {
        console.error("Error recovering file:", error);
        sessionStorage.removeItem("fileData");
      }
    }
  }, []);

  const handleSetFile = async (newFile) => {
    setFile(newFile);
    if (newFile) {
      try {
        const base64Data = await fileToBase64(newFile);
        const fileData = {
          name: newFile.name,
          type: newFile.type,
          lastModified: newFile.lastModified,
          data: base64Data,
        };
        sessionStorage.setItem("fileData", JSON.stringify(fileData));
      } catch (error) {
        console.error("Error saving file:", error);
      }
    } else {
      sessionStorage.removeItem("fileData");
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const base64ToBlob = (base64, type) => {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: type });
  };

  return (
    <FileContext.Provider value={{ file, setFile: handleSetFile }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFile() {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error("useFile must be used within a FileProvider");
  }
  return context;
}
