import React, { useState, useEffect } from 'react';
import { useAuth } from "./AuthContext";

const DebugWindow: React.FC = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const [showDebugWindow, setShowDebugWindow] = useState(false);

    const handleLoginLogout = () => {
        setIsLoggedIn(!isLoggedIn);
    };

    const openDebugWindow = () => {
        setShowDebugWindow(true);
    };

    const closeDebugWindow = () => {
        setShowDebugWindow(false);
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

  return (
    <div className="debug-window">
          <h2>Debug Mode</h2>
          <p>Toggle Login State:</p>
          <button onClick={handleLoginLogout}>
            {isLoggedIn ? "Log Out" : "Log In"}
          </button>
          <button className='debug-window-button' onClick={closeDebugWindow}>
            Close
          </button>
        </div>
  );
};

export default DebugWindow;