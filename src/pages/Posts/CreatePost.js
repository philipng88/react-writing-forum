import React, { useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Page from "../../components/Page";
import DispatchContext from "../../context/DispatchContext";
import StateContext from "../../context/StateContext";

const CreatePost = (props) => {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const {
    user: { token },
  } = appState;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/create-post", { title, body, token });
      appDispatch({ type: "flashMessage", value: "Successfully created post" });
      props.history.push(`/post/${response.data}`);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <Page title="Create New Post">
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label htmlFor="post-title">Title</Form.Label>
          <Form.Control
            onChange={(event) => setTitle(event.target.value)}
            type="text"
            name="title"
            id="post-title"
            autoFocus
            autoComplete="off"
            className="form-control-title"
          />
        </Form.Group>
        <Form.Group className="mb-0">
          <Form.Label htmlFor="post-body">Post</Form.Label>
          <Form.Control
            onChange={(event) => setBody(event.target.value)}
            as="textarea"
            name="body"
            id="post-body"
            className="body-content tall-textarea"
          />
        </Form.Group>
        <small className="form-text">
          <span className="font-weight-bold font-italic">Tip:</span> You can use{" "}
          <a
            href="https://www.markdownguide.org/cheat-sheet/"
            target="_blank"
            rel="noopener noreferrer"
          >
            markdown
          </a>{" "}
          in your post
        </small>
        <Button variant="primary" type="submit" className="d-block mt-3">
          Save New Post
        </Button>
      </Form>
    </Page>
  );
};

export default withRouter(CreatePost);
