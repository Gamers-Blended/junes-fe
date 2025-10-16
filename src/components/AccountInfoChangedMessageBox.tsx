import React from "react";

interface AccountInfoChangedMessageBoxProps {
  message: string;
  onClose?: () => void;
}

const AccountInfoChangedMessageBox: React.FC<
  AccountInfoChangedMessageBoxProps
> = ({ message, onClose = () => console.log("Close clicked") }) => {
  return (
    <div className="account-info-changed-message-box-container">
      <div className="account-info-changed-modal">
        <button className="close-btn common-btn" onClick={onClose}>
          X
        </button>
        <div className="account-info-changed-message">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoChangedMessageBox;
