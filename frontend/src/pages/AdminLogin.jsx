import { useState } from "react";
import Header from "../components/header";
import "./adminLogin.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    userName: "",
    password: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://themepark-server.vercel.app/admin", values)
      .then((res) => {
        res.data.Status == "Success"
          ? navigate("/login/admin/reports")
          : alert(res.data.Error);
      });
  };
  return (
    <div className="admin-page-container">
      <Header />
      <div className="admin-login-container">
        <div className="form-container">
          <h1>Admin Login</h1>
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
