import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from "axios";

const PrivateRoute = () => {
  const [authenticated, setAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      axios
        .post(
          "http://localhost:8080/api/v1/users/verify",
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.data.authenticated) {
            setAuthenticated(true);
            console.log(response);
          } else {
            setAuthenticated(false);
          }
        })
        .catch((error) => {
          console.error("Error verifying authentication status:", error);
          setAuthenticated(false);
        });
    } else {
      setAuthenticated(false);
    }
  }, []);

  return authenticated ? <Outlet /> : <Navigate to="/login" />;
};   
export default PrivateRoute;
