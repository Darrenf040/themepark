import axios from "axios";
import React, { createContext, useContext, useEffect } from "react";

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = React.useState(false); // Your auth state logic here
  const [authMessage, setAuthMessage] = React.useState("");
  const [role, setRole] = React.useState("");
  const [welcomeMessage, setWelcomeMessage] = React.useState("");
  const [loading, setLoading] = React.useState(true); // New loading state

  useEffect(() => {
    // Check the token validity on component mount (when the page is refreshed)
    axios
      .get("https://gleaming-lokum-158537.netlify.app/admin/verify", {
        withCredentials: true, // Ensure cookies are sent along with the request
      })
      .then((res) => {
        if (res.data.Verify && res.data.user.role == "Admin") {
          setAuth(true); // User is authenticated
          setRole(res.data.user.role); // Set role from the response
          setWelcomeMessage(res.data.user.userName);
        } else if (res.data.Verify && res.data.user.role == "Employee") {
          setAuth(true); // User is authenticated
          setRole(res.data.user.role); // Set role from the response
          setWelcomeMessage(
            res.data.user.email.substring(0, res.data.user.email.indexOf("@"))
          );
        } else {
          setAuth(false); // User is not authenticated
          setRole("");
          setWelcomeMessage("");
        }
      })
      .catch(() => {
        setAuth(false); // Token verification failed
        setRole("");
        setWelcomeMessage("");
      })
      .finally(() => {
        setLoading(false); // Mark loading as false after the check is done
      });
  }, []);
  if (loading) {
    return null; // or a loading spinner
  }
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        authMessage,
        setAuthMessage,
        role,
        setRole,
        welcomeMessage,
        setWelcomeMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
