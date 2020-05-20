import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import DispatchContext from "../../context/DispatchContext";
import StateContext from "../../context/StateContext";

const HeaderIcon = styled.span`
  cursor: pointer;
  position: relative;
  top: 3px;
  margin-right: 0.75rem;
  color: #fff;
`;

const ChatCountBadge = styled.span`
  text-align: center;
  position: absolute;
  top: 2px;
  left: 0px;
  width: 16px;
  font-size: 0.6rem;
  font-weight: bold;
  color: #fff;
`;

const HeaderLoggedIn = (props) => {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const handleLogout = () => {
    appDispatch({ type: "logout" });
    props.history.push("/");
  };

  const {
    user: { username, avatar },
  } = appState;

  return (
    <div className="flex-row my-3 my-md-0">
      <HeaderIcon
        onClick={() => appDispatch({ type: "openSearch" })}
        data-tip="Search"
        data-for="searchIcon"
      >
        <i className="fas fa-search"></i>
      </HeaderIcon>
      <ReactTooltip id="searchIcon" place="bottom" />
      <HeaderIcon data-tip="Chat" data-for="chatIcon">
        <i className="fas fa-comment"></i>
        <ChatCountBadge />
      </HeaderIcon>
      <ReactTooltip id="chatIcon" place="bottom" />
      <Link
        to={`/profile/${username}`}
        className="mr-2"
        data-tip={`My Profile (${username})`}
        data-for="profile"
      >
        <img className="small-header-avatar" src={avatar} />
      </Link>
      <ReactTooltip id="profile" place="bottom" />
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <Button variant="secondary" size="sm" onClick={handleLogout}>
        Sign Out
      </Button>
    </div>
  );
};

export default withRouter(HeaderLoggedIn);
