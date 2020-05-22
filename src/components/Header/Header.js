import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoggedIn from "./HeaderLoggedIn";
import StateContext from "../../context/StateContext";

const Header = (props) => {
  const appState = useContext(StateContext);
  const headerContent = appState.loggedIn ? (
    <HeaderLoggedIn />
  ) : (
    <HeaderLoggedOut />
  );

  return (
    <header className="bg-primary mb-3">
      <Container className="d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white text-decoration-none">
            <img
              src="/images/quill.png"
              alt="Logo"
              className="align-baseline"
            />{" "}
            The Mighty Pen
          </Link>
        </h4>
        {!props.staticEmpty ? headerContent : ""}
      </Container>
    </header>
  );
};

export default Header;
