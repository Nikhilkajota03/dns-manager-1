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
          "https://employee-managment-mslv.onrender.com/api/v1/user/verify",
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
