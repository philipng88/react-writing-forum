import React, { useState, useContext } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import axios from "axios";
import DispatchContext from "../../context/DispatchContext";

const HeaderLoggedOut = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const appDispatch = useContext(DispatchContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/login", {
        username,
        password,
      });
      if (response.data) {
        appDispatch({ type: "login", data: response.data });
        appDispatch({ type: "flashMessage", value: "Successfully logged in" });
      } else {
        appDispatch({
          type: "flashMessage",
          value: "Incorrect username and/or password",
        });
      }
    } catch (error) {
      console.log(error.response.data);
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
            className="input-dark"
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
            className="input-dark"
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
