import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import DispatchContext from "../../context/DispatchContext";
import StateContext from "../../context/StateContext";

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
    <>
      <div className="flex-row my-3 my-md-0">
        <a
          href="#"
          className="text-white mr-2 header-search-icon"
          data-tip="Search"
          data-for="searchIcon"
        >
          <i className="fas fa-search"></i>
        </a>
        <span
          className="mr-2 header-chat-icon text-white"
          data-tip="Chat"
          data-for="chatIcon"
        >
          <i className="fas fa-comment"></i>
          <span className="chat-count-badge text-white"> </span>
        </span>
        <a href="#" className="mr-2" data-tip={username} data-for="avatarIcon">
          <img className="small-header-avatar" src={avatar} />
        </a>
        <Link className="btn btn-sm btn-success mr-2" to="/create-post">
          Create Post
        </Link>
        <Button variant="secondary" size="sm" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
      <ReactTooltip id="searchIcon" />
      <ReactTooltip id="chatIcon" />
      <ReactTooltip id="avatarIcon" />
    </>
  );
};

export default withRouter(HeaderLoggedIn);
