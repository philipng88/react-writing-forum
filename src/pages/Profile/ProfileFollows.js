import React, { useState, useEffect, useContext } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingIcon from "../../components/LoadingIcon";
import StateContext from "../../context/StateContext";

const ProfileFollows = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const { username } = useParams();
  const { followType } = props;
  const {
    user: { username: currentUser },
  } = useContext(StateContext);

  useEffect(() => {
    const cancelRequest = axios.CancelToken.source();
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`/profile/${username}/${followType}`, {
          cancelToken: cancelRequest.token,
        });
        setUsers(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
    return () => cancelRequest.cancel();
  }, [username, followType]);

  let content;
  if (users.length) {
    content = (
      <ListGroup>
        {users.map((user, index) => (
          <Link
            key={index}
            className="list-group-item list-group-item-action"
            to={`/profile/${user.username}`}
          >
            <img
              src={user.avatar}
              alt={user.username}
              className="avatar-tiny"
            />{" "}
            {user.username}
          </Link>
        ))}
      </ListGroup>
    );
  } else {
    switch (followType) {
      case "followers":
        content = (
          <p className="h5 font-italic">
            {currentUser == username
              ? "You have no followers"
              : `${username} has no followers. Be the first to follow ${username}!`}
          </p>
        );
        break;
      case "following":
        content = (
          <p className="h5 font-italic">
            {currentUser == username ? "You are" : `${username} is`} currently
            not following any other users
          </p>
        );
        break;
      default:
        break;
    }
  }

  return !isLoading ? content : <LoadingIcon />;
};

export default ProfileFollows;
