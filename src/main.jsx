import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import LandingPage from "./components/LandingPage.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          {/* Public landing page */}
          <Route
            path="/"
            element={
              <SignedOut>
                <LandingPage />
              </SignedOut>
            }
          />

          {/* Auth routes */}
          <Route
            path="/sign-in/*"
            element={<SignIn routing="path" path="/sign-in" />}
          />
          <Route
            path="/sign-up/*"
            element={<SignUp routing="path" path="/sign-up" />}
          />

          {/* Protected dashboard routes */}
          {/* <Route
            path="/dashboard/*"
            element={
              <>
                <SignedIn>
                  <Layout />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="upload" element={<FileUpload />} />
            <Route path="analysis/:id" element={<AnalysisDashboard />} />
            <Route path="history" element={<AnalysisHistory />} />
            <Route path="settings" element={<Settings />} />
          </Route> */}
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
