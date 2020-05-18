import React from "react";
import Alert from "react-bootstrap/Alert";

const FlashMessages = ({ messages }) => {
  return (
    <div className="floating-alerts">
      {messages.map((message, index) => (
        <Alert
          variant="success"
          className="text-center floating-alert shadow-sm"
          key={index}
        >
          {message}
        </Alert>
      ))}
    </div>
  );
};

export default FlashMessages;
