import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

export const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("kevii-gym-token");
  return token ? element : <Navigate to="/login" replace />;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export const AuthRoute = ({ element }) => {
  const token = localStorage.getItem("kevii-gym-token");
  return !token ? element : <Navigate to="/dashboard" replace />;
};

export const AdminRoute = ({ element }) => {
  const token = localStorage.getItem("kevii-gym-token");
  const isAdmin = localStorage.getItem("kevii-gym-admin") === "true";
  return token && isAdmin ? element : <Navigate to="/dashboard" replace />;
};

AuthRoute.propTypes = {
  element: PropTypes.element.isRequired,
};
