import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import axios from "axios";
import Page from "../../components/Page";
import formatDate from "../../util/formatDate";
import LoadingIcon from "../../components/LoadingIcon";

const ViewSinglePost = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();
  const { id } = useParams();

  useEffect(() => {
    const cancelRequest = axios.CancelToken.source();
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/post/${id}`, {
          cancelToken: cancelRequest.token,
        });
        setPost(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchPost();
    return () => cancelRequest.cancel();
  }, []);

  if (isLoading)
    return (
      <Page title="...">
        <LoadingIcon />
      </Page>
    );

  const {
    createdDate,
    title,
    author: { avatar, username },
    body,
  } = post;

  return (
    <Page title={title}>
      <div className="d-flex justify-content-between">
        <h2>{title}</h2>
        <span className="pt-2">
          <a
            href="#"
            className="text-primary mr-2"
            data-tip="Edit"
            data-for="editIcon"
          >
            <i className="fas fa-edit"></i>
          </a>
          <a
            href="#"
            className="text-danger delete-post-button"
            data-tip="Delete"
            data-for="deleteIcon"
          >
            <i className="fas fa-trash"></i>
          </a>
        </span>
      </div>
      <p className="text-muted small mb-4">
        <Link to={`/profile/${username}`}>
          <img src={avatar} alt={username} className="avatar-tiny" />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${username}`} className="text-decoration-none">
          {username}
        </Link>{" "}
        on {formatDate(createdDate)}
      </p>
      <div className="body-content">
        <p>{body}</p>
      </div>
      <ReactTooltip id="editIcon" effect="solid" />
      <ReactTooltip id="deleteIcon" effect="solid" />
    </Page>
  );
};

export default ViewSinglePost;
