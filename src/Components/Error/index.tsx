import React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import "./style.scss";

interface ErrorProps {
  message?: string;
}

const ErrorComponent: React.FC<ErrorProps> = ({
  message = "Something went wrong. Please try again later.",
}) => {
  return (
    <div className="error-container">
      <div className="error-icon">
        <ErrorOutlineIcon className="icon" />
      </div>
      <div className="error-title">Oops!</div>
      <div className="error-message">{message}</div>
    </div>
  );
};

export default ErrorComponent;
