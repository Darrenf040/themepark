import { useState } from "react";
import Header from "../components/header";
import "./adminLogin.css";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { setAuth, setRole, setWelcomeMessage } = useAuth();
  const [values, setValues] = useState({
    userName: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://gleaming-lokum-158537.netlify.app/admin", values, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.auth) {
          axios
            .get("https://gleaming-lokum-158537.netlify.app/admin/verify", {
              withCredentials: true,
            })
            .then((res) => {
              setAuth(res.data.Verify);
              if (res.data.Verify) {
                setRole(res.data.user.role);
                setWelcomeMessage(`${res.data.user.userName}`);
                alert("Granted Access");
                navigate("/login/admin/reports");
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
          <h1>Log In</h1>
          <p>Log in with admin credentials</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              onChange={(e) =>
                setValues({ ...values, userName: e.target.value })
              }
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
