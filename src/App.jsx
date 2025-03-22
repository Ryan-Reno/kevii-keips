import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { PrivateRoute, AuthRoute, AdminRoute } from "./Router";
import { Toaster } from "@/components/ui/toaster";
import Book from "./pages/Book";
import Checkin from "./pages/Checkin";
import Profile from "./pages/Profile";
import { ThemeProvider } from "@/components/theme-provider";
import axiosInstance from "./axiosInstance";
import LoginPilot from "./pages/LoginPilot";
import AdminPage from "./pages/AdminPage";
import QRCodeDisplay from "./pages/QRCode";
import Keips from "./pages/keips";
// import RegisterPilot from "./pages/RegisterPilot";

function App() {
  useEffect(() => {
    axiosInstance
      .post("/api/demerit/check")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axiosInstance
      .post("/api/suspend/auto-check/current-user")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="kevii-gym-booking-ui-theme"
    >
      <div className="font-sans bg-background min-h-screen">
        <div className="absolute right-0 top-4 left-0 md:relative">
          <Toaster />
        </div>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/keips" replace />} />
            <Route
              path="/login"
              element={<AuthRoute element={<LoginPilot />} />}
            />
            <Route path="/keips" element={<PrivateRoute element={<Keips />} />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
