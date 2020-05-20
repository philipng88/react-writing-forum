import React from "react";
import { Link } from "react-router-dom";
import formatDate from "../util/formatDate";

const Post = (props) => {
  const {
    post: {
      _id: id,
      author: { username, avatar },
      title,
      createdDate,
    },
    noImage,
    noAuthor,
    onClick,
  } = props;

  return (
    <Link
      to={`/post/${id}`}
      className="list-group-item list-group-item-action"
      onClick={onClick}
    >
      {!noImage && <img className="avatar-tiny" src={avatar} alt={username} />}
      <span className="font-weight-normal">{title}</span>{" "}
      <span className="text-muted small">
        {!noAuthor && <span>by {username}</span>} on {formatDate(createdDate)}
      </span>
    </Link>
  );
};

export default Post;
