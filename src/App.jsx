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
import Calendar from "./pages/Calendar";
import Book from "./pages/Book";
import BookingsHistory from "./pages/BookingsHistory";
import Checkin from "./pages/Checkin";

function App() {
  return (
    <div className="font-sans bg-background">
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
          <Route
            path="/calendar"
            element={<PrivateRoute element={<Calendar />} />}
          />
          <Route path="/book" element={<PrivateRoute element={<Book />} />} />
          <Route
            path="/bookings"
            element={<PrivateRoute element={<BookingsHistory />} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
