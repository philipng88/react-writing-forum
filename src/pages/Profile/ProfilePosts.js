import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import { useParams } from "react-router-dom";
import LoadingIcon from "../../components/LoadingIcon";
import Post from "../../components/Post";

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
      {posts.map((post) => (
        <Post post={post} key={post._id} noImage noAuthor />
      ))}
    </ListGroup>
  ) : (
    <p className="h5 font-italic">No posts...</p>
  );

  return !isLoading ? content : <LoadingIcon />;
};

export default ProfilePosts;
