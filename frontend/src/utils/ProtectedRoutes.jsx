import PropTypes from "prop-types";
import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoutes({ auth }) {
  return auth ? <Outlet /> : <Navigate to="/admin" />;
}

ProtectedRoutes.propTypes = {
  auth: PropTypes.bool,
};
