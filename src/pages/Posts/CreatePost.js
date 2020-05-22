import React, { useState, useContext } from "react";
import { withRouter, Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Page from "../../components/Page";
import DispatchContext from "../../context/DispatchContext";
import StateContext from "../../context/StateContext";
import MarkdownLink from "../../components/MarkdownLink";

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
      appDispatch({
        type: "flashMessage",
        messageType: "success",
        value: "Successfully created post",
      });
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
            required
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
            required
          />
        </Form.Group>
        <MarkdownLink />
        <div className="d-block mt-3">
          <Link className="btn btn-outline-danger mr-2" to="/">
            Cancel
          </Link>
          <Button variant="primary" type="submit">
            Save New Post
          </Button>
        </div>
      </Form>
    </Page>
  );
};

export default withRouter(CreatePost);
