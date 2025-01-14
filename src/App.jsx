import { useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  useUser,
} from "@clerk/clerk-react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import FileUpload from "./pages/FileUpload";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import QuizGenerator from "./components/QuizGenerator";
import Summary from "./components/Summary";
import Chat from "./components/Chat";
import SmartSearch from "./components/SmartSearch";
import KeyConcepts from "./components/KeyConcepts";

function App() {
  const { isLoaded, user } = useUser();

  // Debug logging
  useEffect(() => {
    console.log("Auth state:", { isLoaded, isSignedIn: !!user });
  }, [isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<LandingPage />} />
      {/* Auth routes */}
      <Route
        path="/sign-in"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8">
              <SignIn
                routing="path"
                path="/sign-in"
                afterSignInUrl="/upload"
                signUpUrl="/sign-up"
              />
            </div>
          </div>
        }
      />
      <Route
        path="/sign-up"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8">
              <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
            </div>
          </div>
        }
      />
      <Route
        path="/analysis"
        element={
          <SignedIn>
            <DocumentAnalysis />
          </SignedIn>
        }
      />
      <Route
        path="/analysis/quiz"
        element={
          <SignedIn>
            <QuizGenerator />
          </SignedIn>
        }
      />
      <Route
        path="/analysis/summary"
        element={
          <SignedIn>
            <Summary />
          </SignedIn>
        }
      />
      <Route
        path="/analysis/chat"
        element={
          <SignedIn>
            <Chat />
          </SignedIn>
        }
      />

      <Route
        path="/analysis/search"
        element={
          <SignedIn>
            <SmartSearch />
          </SignedIn>
        }
      />
      <Route
        path="/analysis/concepts"
        element={
          <SignedIn>
            <KeyConcepts />
          </SignedIn>
        }
      />

      {/* Protected routes */}
      <Route
        path="/upload"
        element={
          <SignedIn>
            <FileUpload />
          </SignedIn>
        }
      />
      {/* Fallback routes */}
      <Route
        path="*"
        element={
          <SignedIn>
            <Navigate to="/upload" replace />
          </SignedIn>
        }
      />
      <Route
        path="*"
        element={
          <SignedOut>
            <Navigate to="/" replace />
          </SignedOut>
        }
      />
    </Routes>
  );
}

export default App;
