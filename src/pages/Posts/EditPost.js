import React, { useEffect, useContext } from "react";
import { useImmerReducer } from "use-immer";
import { useParams, Link, withRouter } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import Page from "../../components/Page";
import LoadingIcon from "../../components/LoadingIcon";
import MarkdownLink from "../../components/MarkdownLink";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import NotFound from "../../components/NotFound";

const EditPost = (props) => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const initialState = {
    title: {
      value: "",
      hasErrors: false,
      message: "",
    },
    body: {
      value: "",
      hasErrors: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  };

  const reducer = (draft, action) => {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        break;
      case "titleChange":
        draft.title.hasErrors = false;
        draft.title.value = action.value;
        break;
      case "bodyChange":
        draft.body.hasErrors = false;
        draft.body.value = action.value;
        break;
      case "submitRequest":
        if (!draft.title.hasErrors && !draft.body.hasErrors) draft.sendCount++;
        break;
      case "saveRequestStarted":
        draft.isSaving = true;
        break;
      case "saveRequestFinished":
        draft.isSaving = false;
        break;
      case "titleRules":
        if (action.value.trim() === "") {
          draft.title.hasErrors = true;
          draft.title.message = "You must provide a title";
        }
        break;
      case "bodyRules":
        if (action.value.trim() === "") {
          draft.body.hasErrors = true;
          draft.body.message = "You must have some post content";
        }
        break;
      case "notFound":
        draft.notFound = true;
        break;
      default:
        throw new Error("Incorrect action type");
    }
  };

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const {
    id,
    isFetching,
    isSaving,
    title: {
      value: titleValue,
      hasErrors: titleHasErrors,
      message: titleErrorMessage,
    },
    body: {
      value: bodyValue,
      hasErrors: bodyHasErrors,
      message: bodyErrorMessage,
    },
    sendCount,
    notFound,
  } = state;

  const {
    user: { token, username },
  } = appState;

  useEffect(() => {
    const cancelRequest = axios.CancelToken.source();
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/post/${id}`, {
          cancelToken: cancelRequest.token,
        });
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data });
          if (username != response.data.author.username) {
            appDispatch({
              type: "flashMessage",
              messageType: "danger",
              value: "You do not have permission to edit that post",
            });
            props.history.push("/");
          }
        } else {
          dispatch({ type: "notFound" });
        }
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchPost();
    return () => cancelRequest.cancel();
  }, []);

  useEffect(() => {
    if (sendCount) {
      dispatch({ type: "saveRequestStarted" });
      const cancelRequest = axios.CancelToken.source();
      const editPost = async () => {
        try {
          await axios.post(
            `/post/${id}/edit`,
            { title: titleValue, body: bodyValue, token },
            { cancelToken: cancelRequest.token }
          );
          dispatch({ type: "saveRequestFinished" });
          appDispatch({
            type: "flashMessage",
            messageType: "info",
            value: "Updated post",
          });
        } catch (error) {
          console.log(error.response.data);
        }
      };
      editPost();
      return () => cancelRequest.cancel();
    }
  }, [sendCount]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({ type: "titleRules", value: titleValue });
    dispatch({ type: "bodyRules", value: bodyValue });
    dispatch({ type: "submitRequest" });
  };

  if (notFound) return <NotFound />;

  return (
    <Page title={isFetching ? "..." : "Edit Post"}>
      {isFetching ? (
        <LoadingIcon />
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label htmlFor="post-title">Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              id="post-title"
              autoFocus
              autoComplete="off"
              className="form-control-title"
              value={titleValue}
              onChange={(event) =>
                dispatch({ type: "titleChange", value: event.target.value })
              }
              onBlur={(event) =>
                dispatch({ type: "titleRules", value: event.target.value })
              }
            />
            {titleHasErrors && (
              <Alert variant="danger" className="small liveValidateMessage">
                {titleErrorMessage}
              </Alert>
            )}
          </Form.Group>
          <Form.Group className="mb-0">
            <Form.Label htmlFor="post-body">Post</Form.Label>
            <Form.Control
              as="textarea"
              name="body"
              id="post-body"
              className="body-content tall-textarea"
              value={bodyValue}
              onChange={(event) =>
                dispatch({ type: "bodyChange", value: event.target.value })
              }
              onBlur={(event) =>
                dispatch({ type: "bodyRules", value: event.target.value })
              }
            />
            {bodyHasErrors && (
              <Alert variant="danger" className="small liveValidateMessage">
                {bodyErrorMessage}
              </Alert>
            )}
          </Form.Group>
          <MarkdownLink />
          <div className="d-block mt-3">
            <Link className="btn btn-outline-secondary mr-2" to={`/post/${id}`}>
              Go Back
            </Link>
            <Button variant="info" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      )}
    </Page>
  );
};

export default withRouter(EditPost);
