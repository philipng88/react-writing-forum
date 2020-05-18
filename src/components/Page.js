import React, { useEffect } from "react";
import Container from "./Container";

const Page = ({ wide, title, children }) => {
  useEffect(() => {
    document.title = title ? `${title} | The Mighty Pen` : "The Mighty Pen";
    window.scrollTo(0, 0);
  }, [title]);

  return <Container wide={wide}>{children}</Container>;
};

export default Page;
