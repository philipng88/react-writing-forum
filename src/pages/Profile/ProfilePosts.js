import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import formatDate from "../../util/formatDate";
import LoadingIcon from "../../components/LoadingIcon";

const ProfilePosts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const cancelRequest = axios.CancelToken.source();
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/profile/${username}/posts`, {
          cancelToken: cancelRequest.token,
        });
        setPosts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchPosts();
    return () => cancelRequest.cancel();
  }, [username]);

  const content = posts.length ? (
    <ListGroup>
      {posts.map((post) => {
        const { _id: id, title, createdDate } = post;
        return (
          <Link
            className="list-group-item list-group-item-action"
            to={`/post/${id}`}
            key={id}
          >
            <span className="font-weight-normal">{title}</span>
            <span className="text-muted small">
              {" "}
              on {formatDate(createdDate)}
            </span>
          </Link>
        );
      })}
    </ListGroup>
  ) : (
    <p className="h5 font-italic">No posts...</p>
  );

  return !isLoading ? content : <LoadingIcon />;
};

export default ProfilePosts;
