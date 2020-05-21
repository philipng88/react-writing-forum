import React, { useEffect, Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { useImmerReducer } from "use-immer";
import axios from "axios";

import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import FlashMessages from "./components/FlashMessages";
import NotFound from "./components/NotFound";
const Search = React.lazy(() => import("./components/Search"));
const Chat = React.lazy(() => import("./components/Chat"));
import LoadingIcon from "./components/LoadingIcon";

import Home from "./pages/Home/Home";
import HomeGuest from "./pages/Home/Guest";
import About from "./pages/About";
import Terms from "./pages/Terms";
const CreatePost = React.lazy(() => import("./pages/Posts/CreatePost"));
const EditPost = React.lazy(() => import("./pages/Posts/EditPost"));
const ViewSinglePost = React.lazy(() => import("./pages/Posts/ViewSinglePost"));
import Profile from "./pages/Profile/Profile";

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
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
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
      case "openSearch":
        draft.isSearchOpen = true;
        break;
      case "closeSearch":
        draft.isSearchOpen = false;
        break;
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen;
        break;
      case "closeChat":
        draft.isChatOpen = false;
        break;
      case "incrementUnreadChatCount":
        draft.unreadChatCount++;
        break;
      case "clearUnreadChatCount":
        draft.unreadChatCount = 0;
        break;
      default:
        throw new Error("Incorrect action type");
    }
  };

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const {
    loggedIn,
    flashMessages,
    user: { token, username, avatar },
    isSearchOpen,
  } = state;

  useEffect(() => {
    if (loggedIn) {
      localStorage.setItem("writing-forum-token", token);
      localStorage.setItem("writing-forum-username", username);
      localStorage.setItem("writing-forum-avatar", avatar);
    } else {
      localStorage.removeItem("writing-forum-token");
      localStorage.removeItem("writing-forum-username");
      localStorage.removeItem("writing-forum-avatar");
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      const cancelRequest = axios.CancelToken.source();
      const checkToken = async () => {
        try {
          const response = await axios.post(
            "/checkToken",
            { token },
            { cancelToken: cancelRequest.token }
          );
          if (!response.data) {
            dispatch({ type: "logout" });
            dispatch({
              type: "flashMessage",
              value: "Your token has expired. Please log in again.",
            });
          }
        } catch (error) {
          console.log(error);
        }
      };
      checkToken();
      return () => cancelRequest.cancel();
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router>
          <FlashMessages messages={flashMessages} />
          <Header />
          <Suspense fallback={<LoadingIcon />}>
            <Switch>
              <Route exact path="/">
                {loggedIn ? <Home /> : <HomeGuest />}
              </Route>
              <Route path="/profile/:username">
                <Profile />
              </Route>
              <Route exact path="/post/:id">
                <ViewSinglePost />
              </Route>
              <Route exact path="/post/:id/edit">
                <EditPost />
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
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Suspense>
          <CSSTransition
            timeout={330}
            in={isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">{loggedIn && <Chat />}</Suspense>
          <Footer />
        </Router>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

ReactDOM.render(<Main />, document.getElementById("app"));
if (module.hot) module.hot.accept();
