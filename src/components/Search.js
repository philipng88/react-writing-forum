import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useImmer } from "use-immer";
import classNames from "classnames";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Alert from "react-bootstrap/Alert";
import DispatchContext from "../context/DispatchContext";
import axios from "axios";
import formatDate from "../util/formatDate";

const Search = () => {
  const appDispatch = useContext(DispatchContext);

  const [state, setState] = useImmer({
    searchValue: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });

  const { searchValue, results, show, requestCount } = state;

  const searchKeyPressHandler = (event) => {
    if (event.keyCode == 27) appDispatch({ type: "closeSearch" });
  };

  useEffect(() => {
    document.addEventListener("keyup", searchKeyPressHandler);
    return () => document.removeEventListener("keyup", searchKeyPressHandler);
  }, []);

  useEffect(() => {
    if (searchValue.trim()) {
      setState((draft) => {
        draft.show = "loading";
      });
      const delay = setTimeout(() => {
        setState((draft) => {
          draft.requestCount++;
        });
      }, 700);
      return () => clearTimeout(delay);
    } else {
      setState((draft) => {
        draft.show = "neither";
      });
    }
  }, [searchValue]);

  useEffect(() => {
    if (requestCount) {
      const cancelRequest = axios.CancelToken.source();
      const fetchResults = async () => {
        try {
          const response = await axios.post(
            "/search",
            { searchTerm: searchValue },
            { cancelToken: cancelRequest.token }
          );
          setState((draft) => {
            draft.results = response.data;
            draft.show = "results";
          });
        } catch (error) {
          console.log(error);
        }
      };
      fetchResults();
      return () => cancelRequest.cancel();
    }
    return () => {};
  }, [requestCount]);

  const handleInput = (event) => {
    const value = event.target.value;
    setState((draft) => {
      draft.searchValue = value;
    });
  };

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <Container className="container--narrow py-3">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
            onChange={handleInput}
          />
          <span
            className="close-live-search"
            title="Close Search"
            onClick={() => appDispatch({ type: "closeSearch" })}
          >
            <i className="fas fa-times-circle"></i>
          </span>
        </Container>
      </div>
      <div className="search-overlay-bottom">
        <Container className="container--narrow py-3">
          <div
            className={classNames("circle-loader", {
              "circle-loader--visible": show == "loading",
            })}
          ></div>
          <div
            className={classNames("live-search-results", {
              "live-search-results--visible": show == "results",
            })}
          >
            {results.length ? (
              <ListGroup className="shadow-sm">
                <ListGroup.Item active>
                  <strong>Search Results</strong> ({results.length}{" "}
                  {results.length > 1 ? "items" : "item"} found)
                </ListGroup.Item>
                {results.map((result) => {
                  const {
                    _id,
                    author: { username, avatar },
                    title,
                    createdDate,
                  } = result;
                  return (
                    <Link
                      key={_id}
                      to={`/post/${_id}`}
                      className="list-group-item list-group-item-action"
                      onClick={() => appDispatch({ type: "closeSearch" })}
                    >
                      <img
                        className="avatar-tiny"
                        src={avatar}
                        alt={username}
                      />
                      <span className="font-weight-normal">{title}</span>{" "}
                      <span className="text-muted small">
                        by {username} on {formatDate(createdDate)}
                      </span>
                    </Link>
                  );
                })}
              </ListGroup>
            ) : (
              <Alert
                variant="danger"
                className="text-center shadow-sm text-capitalize font-weight-normal"
              >
                no results found
              </Alert>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Search;
