import React from "react";

const MarkdownLink = () => {
  return (
    <small className="form-text">
      <strong>Tip:</strong> You can use{" "}
      <a
        href="https://www.markdownguide.org/cheat-sheet/"
        target="_blank"
        rel="noopener noreferrer"
      >
        markdown
      </a>{" "}
      in your post
    </small>
  );
};

export default MarkdownLink;
