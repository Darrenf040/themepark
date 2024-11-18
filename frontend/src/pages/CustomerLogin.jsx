import { useState } from "react";
import Header from "../components/header";
import "./adminLogin.css";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";

export default function AdminLogin() {
  const { setAuth, setRole, setWelcomeMessage } = useAuth();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://themepark-backend.onrender.com/customer/login", values, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.auth) {
          axios
            .get("https://themepark-backend.onrender.com/customer/verify", {
              withCredentials: true,
            })
            .then((res) => {
              setAuth(res.data.Verify);
              if (res.data.Verify) {
                setRole(res.data.customer.role);
                alert("Login Successful");
              }
            });
        } else {
          alert(res.data.Response);
        }
      })
      .catch((err) => alert(err));
  };
  return (
    <div className="admin-page-container">
      <Header />
      <div className="admin-login-container">
        <div className="form-container">
          <h1>Customer Log In</h1>
          <p>Log in with Customer credentials</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Email</label>
            <input
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              type="text"
            />
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              type="password"
            />
            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
    </div>
  );
}

AdminLogin.propTypes = {
  authProp: PropTypes.bool,
};
