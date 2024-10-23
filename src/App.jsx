import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { PrivateRoute, AuthRoute } from "./Router";
import { Toaster } from "@/components/ui/toaster";
import Book from "./pages/Book";
import Checkin from "./pages/Checkin";
import Profile from "./pages/Profile";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="font-sans bg-background min-h-screen">
        <div className="absolute right-0 top-4 left-0 md:relative">
          <Toaster />
        </div>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<AuthRoute element={<Login />} />} />
            <Route
              path="/register"
              element={<AuthRoute element={<Register />} />}
            />
            <Route
              path="/dashboard"
              element={<PrivateRoute element={<Dashboard />} />}
            />
            <Route
              path="/checkin"
              element={<PrivateRoute element={<Checkin />} />}
            />
            <Route path="/book" element={<PrivateRoute element={<Book />} />} />
            <Route
              path="/profile"
              element={<PrivateRoute element={<Profile />} />}
            />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
