import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import axios from "axios";
import Favicon from "react-favicon";

import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import FlashMessages from "./components/FlashMessages";

import Home from "./pages/Home/Home";
import HomeGuest from "./pages/Home/Guest";
import About from "./pages/About";
import Terms from "./pages/Terms";
import CreatePost from "./pages/Posts/CreatePost";
import ViewSinglePost from "./pages/Posts/ViewSinglePost";

import StateContext from "./context/StateContext";
import DispatchContext from "./context/DispatchContext";

axios.defaults.baseURL = "http://localhost:8080";

const Main = () => {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("writing-forum-token")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("writing-forum-token"),
      username: localStorage.getItem("writing-forum-username"),
      avatar: localStorage.getItem("writing-forum-avatar"),
    },
  };

  const reducer = (draft, action) => {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        break;
      case "logout":
        draft.loggedIn = false;
        break;
      case "flashMessage":
        draft.flashMessages.push(action.value);
        break;
      default:
        throw new Error("Incorrect action type");
    }
  };

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("writing-forum-token", state.user.token);
      localStorage.setItem("writing-forum-username", state.user.username);
      localStorage.setItem("writing-forum-avatar", state.user.avatar);
    } else {
      localStorage.removeItem("writing-forum-token");
      localStorage.removeItem("writing-forum-username");
      localStorage.removeItem("writing-forum-avatar");
    }
  }, [state.loggedIn]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Switch>
            <Route exact path="/">
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/post/:id">
              <ViewSinglePost />
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            <Route path="/about-us">
              <About />
            </Route>
            <Route path="/terms">
              <Terms />
            </Route>
          </Switch>
          <Footer />
        </Router>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

ReactDOM.render(
  <>
    <Favicon url="./images/quill.png" />
    <Main />
  </>,
  document.getElementById("app")
);
if (module.hot) module.hot.accept();
