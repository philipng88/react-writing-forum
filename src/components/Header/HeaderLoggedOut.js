import React, { useState, useContext } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import axios from "axios";
import classNames from "classnames";
import DispatchContext from "../../context/DispatchContext";

const HeaderLoggedOut = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [usernameIsEmpty, setUsernameIsEmpty] = useState();
  const [passwordIsEmpty, setPasswordIsEmpty] = useState();
  const appDispatch = useContext(DispatchContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (username && password) {
        setUsernameIsEmpty(false);
        setPasswordIsEmpty(false);
        const response = await axios.post("/login", {
          username,
          password,
        });
        if (response.data) {
          appDispatch({ type: "login", data: response.data });
          appDispatch({
            type: "flashMessage",
            messageType: "success",
            value: "Successfully logged in",
          });
        } else {
          appDispatch({
            type: "flashMessage",
            messageType: "danger",
            value: "Incorrect username and/or password",
          });
        }
      } else if (!username && password) {
        setUsernameIsEmpty(true);
        setPasswordIsEmpty(false);
        appDispatch({
          type: "flashMessage",
          messageType: "danger",
          value: "Please enter your username",
        });
      } else if (username && !password) {
        setUsernameIsEmpty(false);
        setPasswordIsEmpty(true);
        appDispatch({
          type: "flashMessage",
          messageType: "danger",
          value: "Please enter your password",
        });
      } else {
        setUsernameIsEmpty(true);
        setPasswordIsEmpty(true);
        appDispatch({
          type: "flashMessage",
          messageType: "danger",
          value: "Please enter your username and password",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <Row className="align-items-center">
        <Col md={true} className="mr-0 pr-md-0 mb-3 mb-md-0">
          <Form.Control
            onChange={(event) => setUsername(event.target.value)}
            size="sm"
            name="username"
            className={classNames("input-dark", {
              "is-invalid pr-2": usernameIsEmpty,
            })}
            type="text"
            placeholder="Username"
            autoComplete="off"
          />
        </Col>
        <Col md={true} className="mr-0 pr-md-0 mb-3 mb-md-0">
          <Form.Control
            onChange={(event) => setPassword(event.target.value)}
            size="sm"
            name="password"
            className={classNames("input-dark", {
              "is-invalid pr-2": passwordIsEmpty,
            })}
            type="password"
            placeholder="Password"
          />
        </Col>
        <Col md="auto">
          <Button variant="success" size="sm" type="submit">
            Sign In
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default HeaderLoggedOut;
