import React, { useEffect, useContext } from "react";
import { useImmer } from "use-immer";
import { useParams, NavLink, Switch, Route } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import axios from "axios";
import Page from "../../components/Page";
import StateContext from "../../context/StateContext";
import ProfilePosts from "./ProfilePosts";
import ProfileFollows from "./ProfileFollows";

const Profile = () => {
  const { username } = useParams();
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: { postCount: "", followerCount: "", followingCount: "" },
    },
  });

  const {
    loggedIn,
    user: { token, username: currentUser },
  } = appState;

  const {
    followActionLoading,
    startFollowingRequestCount,
    stopFollowingRequestCount,
    profileData: {
      profileUsername,
      profileAvatar,
      isFollowing,
      counts: { postCount, followerCount, followingCount },
    },
  } = state;

  useEffect(() => {
    const cancelRequest = axios.CancelToken.source();
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `/profile/${username}`,
          { token },
          { cancelToken: cancelRequest.token }
        );
        setState((draft) => {
          draft.profileData = response.data;
        });
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchData();
    return () => cancelRequest.cancel();
  }, [username]);

  useEffect(() => {
    if (startFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });
      const cancelRequest = axios.CancelToken.source();
      const fetchData = async () => {
        try {
          await axios.post(
            `/addFollow/${profileUsername}`,
            { token },
            { cancelToken: cancelRequest.token }
          );
          setState((draft) => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });
        } catch (error) {
          console.log(error.response.data);
        }
      };
      fetchData();
      return () => cancelRequest.cancel();
    }
  }, [startFollowingRequestCount]);

  useEffect(() => {
    if (stopFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });
      const cancelRequest = axios.CancelToken.source();
      const fetchData = async () => {
        try {
          await axios.post(
            `/removeFollow/${profileUsername}`,
            { token },
            { cancelToken: cancelRequest.token }
          );
          setState((draft) => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followActionLoading = false;
          });
        } catch (error) {
          console.log(error.response.data);
        }
      };
      fetchData();
      return () => cancelRequest.cancel();
    }
  }, [stopFollowingRequestCount]);

  const followAction = (type) => {
    switch (type) {
      case "start":
        setState((draft) => {
          draft.startFollowingRequestCount++;
        });
        break;
      case "stop":
        setState((draft) => {
          draft.stopFollowingRequestCount++;
        });
        break;
      default:
        break;
    }
  };

  return (
    <Page title={profileUsername}>
      <h2>
        <img className="avatar-small" src={profileAvatar} /> {profileUsername}
        {loggedIn &&
          !isFollowing &&
          currentUser != profileUsername &&
          profileUsername != "..." && (
            <Button
              variant="primary"
              size="sm"
              className="ml-2"
              disabled={followActionLoading}
              onClick={() => followAction("start")}
            >
              Follow <i className="fas fa-user-plus"></i>
            </Button>
          )}
        {loggedIn &&
          isFollowing &&
          currentUser != profileUsername &&
          profileUsername != "..." && (
            <Button
              variant="danger"
              size="sm"
              className="ml-2"
              disabled={followActionLoading}
              onClick={() => followAction("stop")}
            >
              Unfollow <i className="fas fa-user-times"></i>
            </Button>
          )}
      </h2>
      <Nav variant="tabs" className="pt-2 mb-4" defaultActiveKey="/posts">
        <Nav.Item>
          <NavLink
            exact
            to={`/profile/${profileUsername}`}
            className="nav-link"
          >
            Posts: {postCount}
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink
            to={`/profile/${profileUsername}/followers`}
            className="nav-link"
          >
            Followers: {followerCount}
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink
            to={`/profile/${profileUsername}/following`}
            className="nav-link"
          >
            Following: {followingCount}
          </NavLink>
        </Nav.Item>
      </Nav>
      <Switch>
        <Route exact path="/profile/:username">
          <ProfilePosts />
        </Route>
        <Route path="/profile/:username/followers">
          <ProfileFollows followType="followers" />
        </Route>
        <Route path="/profile/:username/following">
          <ProfileFollows followType="following" />
        </Route>
      </Switch>
    </Page>
  );
};

export default Profile;
