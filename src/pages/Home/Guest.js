import React, { useEffect, useContext } from "react";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Page from "../../components/Page";
import DispatchContext from "../../context/DispatchContext";

const HomeGuest = () => {
  const appDispatch = useContext(DispatchContext);

  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    email: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    password: { value: "", hasErrors: false, message: "" },
    submitCount: 0,
  };

  const reducer = (draft, action) => {
    switch (action.type) {
      case "usernameImmediately":
        draft.username.hasErrors = false;
        draft.username.value = action.value;
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true;
          draft.username.message = "Username cannot exceed 30 characters";
        }
        if (
          draft.username.value &&
          !/^([a-zA-Z0-9]+)$/.test(draft.username.value)
        ) {
          draft.username.hasErrors = true;
          draft.username.message =
            "Username can only contain letters and numbers";
        }
        break;
      case "usernameAfterDelay":
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true;
          draft.username.message = "Username must have at least 3 characters";
        }
        if (!draft.username.hasErrors && !action.noRequest)
          draft.username.checkCount++;
        break;
      case "usernameUniqueResults":
        if (action.value) {
          draft.username.hasErrors = true;
          draft.username.isUnique = false;
          draft.username.message = "That username is already taken";
        } else {
          draft.username.isUnique = true;
        }
        break;
      case "emailImmediately":
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        break;
      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true;
          draft.email.message = "You must provide a valid email address";
        }
        if (!draft.email.hasErrors && !action.noRequest)
          draft.email.checkCount++;
        break;
      case "emailUniqueResults":
        if (action.value) {
          draft.email.hasErrors = true;
          draft.email.isUnique = false;
          draft.email.message = "That email is already in use";
        } else {
          draft.email.isUnique = true;
        }
        break;
      case "passwordImmediately":
        draft.password.hasErrors = false;
        draft.password.value = action.value;
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true;
          draft.password.message = "Password cannot exceed 50 characters";
        }
        break;
      case "passwordAfterDelay":
        if (draft.password.value.length < 12) {
          draft.password.hasErrors = true;
          draft.password.message = "Password must be at least 12 characters";
        }
        break;
      case "submitForm":
        const validationPassed =
          !draft.username.hasErrors &&
          draft.username.isUnique &&
          !draft.email.hasErrors &&
          draft.email.isUnique &&
          !draft.password.hasErrors;
        if (validationPassed) draft.submitCount++;
        break;
      default:
        throw new Error("Incorrect action type");
    }
  };

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const {
    username: {
      message: usernameValidationMessage,
      hasErrors: usernameHasErrors,
      value: usernameValue,
      checkCount: usernameCheckCount,
    },
    email: {
      message: emailValidationMessage,
      hasErrors: emailHasErrors,
      value: emailValue,
      checkCount: emailCheckCount,
    },
    password: {
      message: passwordValidationMessage,
      hasErrors: passwordHasErrors,
      value: passwordValue,
    },
    submitCount,
  } = state;

  useEffect(() => {
    if (usernameValue) {
      const delay = setTimeout(
        () => dispatch({ type: "usernameAfterDelay" }),
        800
      );
      return () => clearTimeout(delay);
    }
  }, [usernameValue]);

  useEffect(() => {
    if (emailValue) {
      const delay = setTimeout(
        () => dispatch({ type: "emailAfterDelay" }),
        800
      );
      return () => clearTimeout(delay);
    }
  }, [emailValue]);

  useEffect(() => {
    if (passwordValue) {
      const delay = setTimeout(
        () => dispatch({ type: "passwordAfterDelay" }),
        800
      );
      return () => clearTimeout(delay);
    }
  }, [passwordValue]);

  useEffect(() => {
    if (usernameCheckCount) {
      const cancelRequest = axios.CancelToken.source();
      const checkUniqueUsername = async () => {
        try {
          const response = await axios.post(
            "/doesUsernameExist",
            { username: usernameValue },
            { cancelToken: cancelRequest.token }
          );
          dispatch({ type: "usernameUniqueResults", value: response.data });
        } catch (error) {
          console.log(error);
        }
      };
      checkUniqueUsername();
      return () => cancelRequest.cancel();
    }
  }, [usernameCheckCount]);

  useEffect(() => {
    if (emailCheckCount) {
      const cancelRequest = axios.CancelToken.source();
      const checkUniqueEmail = async () => {
        try {
          const response = await axios.post(
            "/doesEmailExist",
            { email: emailValue },
            { cancelToken: cancelRequest.token }
          );
          dispatch({ type: "emailUniqueResults", value: response.data });
        } catch (error) {
          console.log(error);
        }
      };
      checkUniqueEmail();
      return () => cancelRequest.cancel();
    }
  }, [emailCheckCount]);

  useEffect(() => {
    if (submitCount) {
      const cancelRequest = axios.CancelToken.source();
      const registerUser = async () => {
        try {
          const response = await axios.post(
            "/register",
            {
              username: usernameValue,
              email: emailValue,
              password: passwordValue,
            },
            { cancelToken: cancelRequest.token }
          );
          appDispatch({ type: "login", data: response.data });
          appDispatch({
            type: "flashMessage",
            messageType: "success",
            value: "Welcome to your new account!",
          });
        } catch (error) {
          console.log(error);
        }
      };
      registerUser();
      return () => cancelRequest.cancel();
    }
  }, [submitCount]);

  const runValidationBeforeSubmit = () => {
    dispatch({ type: "usernameImmediately", value: usernameValue });
    dispatch({
      type: "usernameAfterDelay",
      value: usernameValue,
      noRequest: true,
    });
    dispatch({ type: "emailImmediately", value: emailValue });
    dispatch({ type: "emailAfterDelay", value: emailValue, noRequest: true });
    dispatch({ type: "passwordImmediately", value: passwordValue });
    dispatch({ type: "passwordAfterDelay", value: passwordValue });
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
          <Form
            onSubmit={(event) => {
              event.preventDefault();
              runValidationBeforeSubmit();
              dispatch({ type: "submitForm" });
            }}
          >
            <Form.Group>
              <Form.Label
                htmlFor="username-register"
                className="text-muted mb-1"
              >
                <small>Username</small>
              </Form.Label>
              <Form.Control
                onChange={(event) =>
                  dispatch({
                    type: "usernameImmediately",
                    value: event.target.value,
                  })
                }
                id="username-register"
                name="username"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
              />
              <CSSTransition
                in={usernameHasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <Alert variant="danger" className="small liveValidateMessage">
                  {usernameValidationMessage}
                </Alert>
              </CSSTransition>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </Form.Label>
              <Form.Control
                onChange={(event) =>
                  dispatch({
                    type: "emailImmediately",
                    value: event.target.value,
                  })
                }
                id="email-register"
                name="email"
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
              />
              <CSSTransition
                in={emailHasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <Alert variant="danger" className="small liveValidateMessage">
                  {emailValidationMessage}
                </Alert>
              </CSSTransition>
            </Form.Group>
            <Form.Group>
              <Form.Label
                htmlFor="password-register"
                className="text-muted mb-1"
              >
                <small>Password</small>
              </Form.Label>
              <Form.Control
                onChange={(event) =>
                  dispatch({
                    type: "passwordImmediately",
                    value: event.target.value,
                  })
                }
                id="password-register"
                name="password"
                type="password"
                placeholder="Create a password"
              />
              <CSSTransition
                in={passwordHasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <Alert variant="danger" className="small liveValidateMessage">
                  {passwordValidationMessage}
                </Alert>
              </CSSTransition>
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
