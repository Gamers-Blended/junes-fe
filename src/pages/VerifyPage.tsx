import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { NavigationState } from "../types/navigationState";
import { Credentials } from "../utils/Enums.tsx";
import {
  REQUEST_MAPPING,
  apiClient,
  getApiErrorMessage,
} from "../utils/api.ts";

interface VerifyPageProps {
  offlineMode?: boolean;
}

const VerifyPage: React.FC<VerifyPageProps> = ({
  offlineMode = import.meta.env.VITE_OFFLINE_MODE === "true",
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");

    const verifyEmail = async () => {
      if (offlineMode) {
        console.log("Offline mode: Skipping verify email API call");
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        try {
          await apiClient.get(`${REQUEST_MAPPING}/auth/verify?token=${token}`);
        } catch (error) {
          setApiError(
            getApiErrorMessage(
              error,
              "Failed to verify email. Your token may be invalid or has expired. Please try creating an account again.",
            ),
          );
          console.error("Error verifying email:", error);
          return;
        }
      }

      console.log("Email verified");
      const state: NavigationState = {
        from: "verify",
        successMessage: "Email verified",
        fieldToChange: Credentials.EMAIL,
      };
      navigate("/usercredentialschanged/", { state });
      // No need to set isLoading to false here as we navigate away
    };

    verifyEmail();
  }, []);

  return (
    <>
      {apiError.length > 0 ? (
        <p>Error: {apiError}</p>
      ) : (
        <p>Verifying your email...</p>
      )}
    </>
  );
};

export default VerifyPage;
