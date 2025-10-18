import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Redirect to login if user is not logged in
export const useAuthRedirect = (isLoggedIn: boolean, redirectTo: string = "/login") => {
    const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(redirectTo, { replace: true });
    }
  }, [isLoggedIn, navigate, redirectTo]);
};