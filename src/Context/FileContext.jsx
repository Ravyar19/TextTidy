import { createContext, useContext, useState } from "react";

const FileContext = createContext();

export function FileProvider({ children }) {
  const [file, setFile] = useState();

  return (
    <FileContext.Provider value={{ file, setFile }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFile() {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error("useFile must be used within a provider");
  }

  return context;
}
