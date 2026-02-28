import React from "react";

export type MessageBoxMode = "success" | "info";

interface AccountInfoChangedMessageBoxProps {
  message: string;
  mode?: MessageBoxMode;
  onClose?: () => void;
}

const AccountInfoChangedMessageBox: React.FC<
  AccountInfoChangedMessageBoxProps
> = ({
  message,
  mode = "success",
  onClose = () => console.log("Close clicked"),
}) => {
  return (
    <div className="account-info-changed-message-box-container">
      <div
        className={`account-info-changed-modal ${mode === "info" ? "account-info-changed-modal--info" : ""}`}
      >
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
