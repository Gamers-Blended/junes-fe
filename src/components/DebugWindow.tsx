import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "./AuthContext";
import { useDebug } from "./DebugContext";
import { toLocalDateInputValue } from "../utils/dateUtils";

const DebugWindow: React.FC = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const { debugDate, setDebugDate } = useDebug();
    const [showDebugWindow, setShowDebugWindow] = useState(false);

    const handleLoginLogout = () => {
        setIsLoggedIn(!isLoggedIn);
    };

    // useCallback keeps a stable reference
    // to prevent re-running and re-injecting the button on every render
    const openDebugWindow = useCallback(() => {
        setShowDebugWindow(true);
    }, []);

    const closeDebugWindow = useCallback(() => {
        setShowDebugWindow(false);
    }, []);

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value; // YYYY-MM-DD
        // Force local-midnight parsing to avoid timezone issues
        setDebugDate(value ? new Date(value + 'T00:00:00') : null);
    };

    // Add a button to toggle debug window
    useEffect(() => {
        if (typeof window !== "undefined") {
            const debugButton = document.createElement("button");
            debugButton.innerText = "Toggle Debug Mode";
            debugButton.style.position = "fixed";
            debugButton.style.bottom = "2px";
            debugButton.style.left = "2px";
            debugButton.style.zIndex = "1000";
            debugButton.onclick = openDebugWindow;
            document.body.appendChild(debugButton);

            return () => {
                if (document.body.contains(debugButton)) {
                document.body.removeChild(debugButton);
                }
            };
        }
    }, [openDebugWindow]);

    if (!showDebugWindow) return null; // Don't render if not visible

    const dateInputValue = debugDate ? toLocalDateInputValue(debugDate) : "";

  return (
    <div className="debug-window">
          <h2>Debug Mode</h2>
          
          <p>Toggle Login State:</p>
          <button onClick={handleLoginLogout}>
            {isLoggedIn ? "Log Out" : "Log In"}
          </button>

          <p>Debug Date:</p>
          <input
            type="date"
            value={dateInputValue}
            onChange={handleDateChange}
          />

          <button className='debug-window-button' onClick={closeDebugWindow}>
            Close
          </button>
        </div>
  );
};

export default DebugWindow;