import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Redirect to login if user is not logged in
export const useAuthRedirect = (
  isLoggedIn: boolean,
  redirectTo: string = "/login",
) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(redirectTo, {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [isLoggedIn, navigate, redirectTo, location.pathname]);
};
