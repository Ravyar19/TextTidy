import { AlertCircle, Book, Loader, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Chat() {
  const location = useLocation();
  const file = location.state?.file;
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "Hello! I'm here to help you understand your document. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
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
            model: "gpt-3.5-turbo-0125",
            messages: [
              {
                role: "system",
                content: `You are a helpful assistant that answers questions about a document. Here's the document content ${fileContent?.slice(
                  0,
                  6000
                )},
                 `,
              },
              ...messages.filter((m) => m.role !== "system"),
              { role: "user", content: userMessage },
            ],
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (error) {
      console.error("Error generating summary:", error);
      setError("Failed to get response. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex items-center space-x-3">
            <Book className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="font-medium">{file?.name}</h2>
              <p className="text-sm text-gray-500">
                {" "}
                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "N/A"}
              </p>
            </div>
          </div>
        </div>
        <div>
          <div>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div>{message.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 p-3 rounded-lg flex items-center space-x-2">
                  <Loader className=" w-4 h-4 animate-spin " />
                  <span>Thinking</span>
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-center mb-4">
                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about your document..."
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={2}
                disabled={loading}
              />
              <button
                className={`px-4 py-2 rounded-lg text-white flex items-center space-x-2 ${
                  loading || !input.trim()
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <Send className="w-4 h-4" />
                <span>send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
