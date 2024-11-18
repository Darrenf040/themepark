import { useState } from "react";
import Header from "../components/header";
import "./adminLogin.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const { setAuth, setRole, setWelcomeMessage } = useAuth();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/employees/auth", values, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.auth) {
          axios
            .get("http://localhost:3000/employees/verify", {
              withCredentials: true,
            })
            .then((res) => {
              setAuth(res.data.Verify);
              if (res.data.Verify) {
                const { email } = res.data.user;
                const name = email.substring(0, email.indexOf("@"));
                setWelcomeMessage(name);
                alert("Granted Access");
                setRole(res.data.user.role);
                navigate("/login/employees/dashboard");
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
          <h1>Employee Login</h1>
          <p>Log in with employee credentials</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
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
