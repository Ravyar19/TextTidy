import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Search, Loader, AlertCircle, ArrowRight } from "lucide-react";

function SmartSearch() {
  const { file } = useFile();

  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

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

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim() || loading) return;

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
                content: `You are a search assistant. Search through this document and return relevant excerpts with explanations. Document content: ${fileContent?.slice(
                  0,
                  6000
                )}`,
              },
              {
                role: "user",
                content: `Find information about: ${searchQuery}. Return response as JSON in this format:
              {
                "results": [
                  {
                    "excerpt": "The relevant text from the document",
                    "explanation": "Why this is relevant",
                    "confidence": 0.8 // number between 0 and 1
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
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const results = JSON.parse(data.choices[0].message.content);

      setSearchResults(results.results);

      // Add to recent searches if not already present
      setRecentSearches((prev) => {
        const newSearches = [
          searchQuery,
          ...prev.filter((s) => s !== searchQuery),
        ].slice(0, 5);
        return newSearches;
      });
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* File Info */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex items-center space-x-3">
            <Book className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="font-medium">{file?.name}</h2>
              <p className="text-sm text-gray-500">
                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Search Interface */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-6 space-x-2">
            <Search className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Smart Search</h2>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="What would you like to find?"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={loading || !query.trim()}
                className={`px-6 py-2 rounded-lg flex items-center space-x-2 ${
                  loading || !query.trim()
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-2">Recent searches:</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(search);
                        handleSearch(search);
                      }}
                      className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-600">Searching...</span>
            </div>
          )}

          {/* Search Results */}
          {!loading && searchResults.length > 0 && (
            <div className="space-y-6">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="bg-gray-50 p-3 rounded-lg mb-3">
                        <p className="text-gray-800">{result.excerpt}</p>
                      </div>
                      <p className="text-gray-600">{result.explanation}</p>
                    </div>
                    <div className="ml-4 flex flex-col items-end">
                      <div className="text-sm font-medium text-gray-500">
                        Confidence
                      </div>
                      <div
                        className={`text-lg font-semibold ${
                          result.confidence >= 0.7
                            ? "text-green-600"
                            : result.confidence >= 0.4
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {Math.round(result.confidence * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results State */}
          {!loading && query && searchResults.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SmartSearch;
