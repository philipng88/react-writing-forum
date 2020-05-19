import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import Page from "../../components/Page";
import formatDate from "../../util/formatDate";
import LoadingIcon from "../../components/LoadingIcon";
import NotFound from "../../components/NotFound";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";

const ViewSinglePost = (props) => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
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

  if (!isLoading && !post) return <NotFound />;

  if (isLoading)
    return (
      <Page title="...">
        <LoadingIcon />
      </Page>
    );

  const {
    _id,
    createdDate,
    title,
    author: { avatar, username },
    body,
  } = post;

  const {
    loggedIn,
    user: { username: currentUser, token },
  } = appState;

  const isOwner = () => {
    if (loggedIn) return currentUser == username;
    return false;
  };

  const deleteHandler = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.delete(`/post/${id}`, { data: { token } });
        if (response.data == "Success") {
          appDispatch({
            type: "flashMessage",
            value: "Successfully deleted post",
          });
          props.history.push(`/profile/${currentUser}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Page title={title}>
      <div className="d-flex justify-content-between">
        <h2>{title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${_id}/edit`}
              className="text-primary mr-2"
              data-tip="Edit"
              data-for="editIcon"
            >
              <i className="fas fa-edit"></i>
            </Link>{" "}
            <span
              onClick={deleteHandler}
              className="text-danger"
              data-tip="Delete"
              data-for="deleteIcon"
              style={{ cursor: "pointer" }}
            >
              <i className="fas fa-trash"></i>
            </span>
          </span>
        )}
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
        <ReactMarkdown
          source={body}
          allowedTypes={[
            "paragraph",
            "strong",
            "emphasis",
            "text",
            "heading",
            "list",
            "listItem",
          ]}
        />
      </div>
      <ReactTooltip id="editIcon" effect="solid" />
      <ReactTooltip id="deleteIcon" effect="solid" />
    </Page>
  );
};

export default withRouter(ViewSinglePost);
