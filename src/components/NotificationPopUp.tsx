import React, { useEffect } from 'react';

interface NotificationPopUpProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number; // Milliseconds
}

const NotificationPopUp: React.FC<NotificationPopUpProps> = ({ message, isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        // Set a timer to close the notification after the specified duration
        onClose();
      }, duration);

      return () => clearTimeout(timer); // Cleanup the timer on unmount or when isVisible changes
    }
}, [isVisible, onClose, duration]);

if (!isVisible) return null; // Don't render if not visible

return (
  <div className="notification-popup-container">
    <div className="notification-popup-content">
      <p>{message}</p>
    </div>
  </div>
);
};

export default NotificationPopUp;
