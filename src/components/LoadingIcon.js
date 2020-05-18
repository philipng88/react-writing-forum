import React from "react";
import styled, { keyframes } from "styled-components";

const opacityChange = keyframes`
  0%,
  100% {
    opacity: 0;
  }

  60% {
    opacity: 1;
  }
`;

const DotsLoading = styled.div`
  margin: 0 auto;
  text-align: center;

  &::before,
  &::after {
    content: " ";
  }

  div,
  &::before,
  &::after {
    margin: 35px 5px;
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #c4c4c4;
    opacity: 0;
  }

  div,
  &::after {
    animation-fill-mode: infinite;
  }

  &::before {
    animation: ${opacityChange} 1s ease-in-out infinite;
  }

  div {
    animation: ${opacityChange} 1s ease-in-out 0.33s infinite;
  }

  &::after {
    animation: ${opacityChange} 1s ease-in-out 0.66s infinite;
  }
`;

const LoadingIcon = () => {
  return (
    <DotsLoading>
      <div></div>
    </DotsLoading>
  );
};

export default LoadingIcon;
