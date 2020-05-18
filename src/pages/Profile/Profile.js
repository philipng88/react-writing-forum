import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import axios from "axios";
import Page from "../../components/Page";
import StateContext from "../../context/StateContext";
import ProfilePosts from "./ProfilePosts";

const Profile = () => {
  const { username } = useParams();
  const appState = useContext(StateContext);
  const [profileData, setProfileData] = useState({
    profileUsername: "...",
    profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
    isFollowing: false,
    counts: { postCount: "", followerCount: "", followingCount: "" },
  });

  const {
    user: { token },
  } = appState;

  const {
    profileAvatar,
    profileUsername,
    counts: { postCount, followerCount, followingCount },
  } = profileData;

  useEffect(() => {
    const cancelRequest = axios.CancelToken.source();
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `/profile/${username}`,
          { token },
          { cancelToken: cancelRequest.token }
        );
        setProfileData(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchData();
    return () => cancelRequest.cancel();
  }, []);

  return (
    <Page title={profileUsername}>
      <h2>
        <img className="avatar-small" src={profileAvatar} /> {profileUsername}
        <Button variant="primary" size="sm" className="ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </Button>
      </h2>
      <Nav variant="tabs" className="pt-2 mb-4" defaultActiveKey="/posts">
        <Nav.Item>
          <Nav.Link href="/posts">Posts: {postCount}</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#">Followers: {followerCount}</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#">Following: {followingCount}</Nav.Link>
        </Nav.Item>
      </Nav>
      <ProfilePosts />
    </Page>
  );
};

export default Profile;
