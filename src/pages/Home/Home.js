import React, { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import axios from "axios";
import ListGroup from "react-bootstrap/ListGroup";
import Page from "../../components/Page";
import StateContext from "../../context/StateContext";
import LoadingIcon from "../../components/LoadingIcon";
import Post from "../../components/Post";

const Home = () => {
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });

  const {
    user: { username: currentUser, token },
  } = appState;

  const { isLoading, feed } = state;

  useEffect(() => {
    const cancelRequest = axios.CancelToken.source();
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "/getHomeFeed",
          { token },
          { cancelToken: cancelRequest.token }
        );
        setState((draft) => {
          draft.isLoading = false;
          draft.feed = response.data;
        });
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchData();
    return () => cancelRequest.cancel();
  }, []);

  return !isLoading ? (
    <Page title="Your Feed">
      {feed.length ? (
        <>
          <h2 className="text-center text-capitalize mb-4">
            the latest from those you follow
          </h2>
          <ListGroup>
            {feed.map((post) => (
              <Post post={post} key={post._id} />
            ))}
          </ListGroup>
        </>
      ) : (
        <>
          <h2 className="text-center">
            Hello <strong>{currentUser}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If
            you don&rsquo;t have any friends to follow that&rsquo;s okay, you
            can use the &ldquo;Search&rdquo; feature in the top menu bar to find
            content written by people with similar interests and then follow
            them.
          </p>
        </>
      )}
    </Page>
  ) : (
    <LoadingIcon />
  );
};

export default Home;
