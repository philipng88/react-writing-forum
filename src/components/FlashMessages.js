import React from "react";
import Alert from "react-bootstrap/Alert";
import styled, { keyframes } from "styled-components";

const floatingAlert = keyframes`
  0% {
    opacity: 0;
    visibility: hidden;
    transform: translateX(-50%) scale(1.2);
  }

  9% {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) scale(1);
  }

  91% {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) scale(1);
  }

  100% {
    opacity: 0;
    visibility: hidden;
    transform: translateX(-50%) scale(1.2);
  }
`;

const FloatingAlerts = styled.div`
  .floating-alert {
    display: none;
    position: absolute;
    z-index: 999;
    top: 38px;
    left: 50%;
    transform: translateX(-50%);
    animation: ${floatingAlert} ease-in 5s forwards;
    animation-fill-mode: forwards;
    &:last-of-type {
      display: block;
    }
  }
`;

const FlashMessages = ({ messages }) => {
  return (
    <FloatingAlerts>
      {messages.map((message, index) => (
        <Alert
          variant="success"
          className="text-center floating-alert shadow-sm"
          key={index}
        >
          {message}
        </Alert>
      ))}
    </FloatingAlerts>
  );
};

export default FlashMessages;
