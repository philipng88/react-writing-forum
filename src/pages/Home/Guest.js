import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Page from "../../components/Page";

const HomeGuest = () => {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/register", {
        username,
        email,
        password,
      });
      console.log("User was successfully created");
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <Page wide>
      <Row className="align-items-center">
        <Col lg={7} className="py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">
            Are you sick of short tweets and impersonal &ldquo;shared&rdquo;
            posts that are reminiscent of the late 90&rsquo;s email forwards? We
            believe getting back to actually writing is the key to enjoying the
            internet again.
          </p>
        </Col>
        <Col lg={5} className="pl-lg-5 pb-3 py-lg-5">
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label
                htmlFor="username-register"
                className="text-muted mb-1"
              >
                <small>Username</small>
              </Form.Label>
              <Form.Control
                onChange={(event) => setUsername(event.target.value)}
                id="username-register"
                name="username"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </Form.Label>
              <Form.Control
                onChange={(event) => setEmail(event.target.value)}
                id="email-register"
                name="email"
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label
                htmlFor="password-register"
                className="text-muted mb-1"
              >
                <small>Password</small>
              </Form.Label>
              <Form.Control
                onChange={(event) => setPassword(event.target.value)}
                id="password-register"
                name="password"
                type="password"
                placeholder="Create a password"
              />
            </Form.Group>
            <Button
              type="submit"
              variant="success"
              size="lg"
              block
              className="py-3 mt-4 text-capitalize"
            >
              sign up for the mighty pen
            </Button>
          </Form>
        </Col>
      </Row>
    </Page>
  );
};

export default HomeGuest;
