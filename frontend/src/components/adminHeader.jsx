import "./adminHeader.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../utils/AuthProvider";

export default function AdminHeader() {
  const { setAuth, setRole, welcomeMessage, setWelcomeMessage } = useAuth();

  const handleLogout = () => {
    axios
      .post("https://gleaming-lokum-158537.netlify.app/admin/logout", [], {
        withCredentials: true,
      })
      .then((res) => {
        alert(res.data.Response);
        setAuth(false);
        setRole("");
        setWelcomeMessage("");
      })
      .catch((err) => alert(err));
  };
  return (
    <>
      <div className="admin-header">
        <Link to="/">
          <h1>Themepark</h1>
        </Link>
        <div className="admin-tabs">
          <Link to={"/login/admin/reports"}>Reports</Link>
          <Link to={"/login/admin/employees"}>Employees</Link>
          <Link to={"/login/admin/parkstatus"}>Park Status</Link>
          <Link to={"/login/admin/tickets"}>Tickets</Link>
        </div>
        <div className="header-button-container">
          <Link to="/login" Log Out>
            <button className="logoutbutton" onClick={handleLogout}>
              Log Out
            </button>
          </Link>
        </div>
      </div>
      <div className="admin-banner">
        <h1>
          Admin Dashboard - <span>Welcome {welcomeMessage}</span>
        </h1>
      </div>
    </>
  );
}
