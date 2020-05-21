import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useImmer } from "use-immer";
import classNames from "classnames";
import io from "socket.io-client";
import StateContext from "../context/StateContext";
import DispatchContext from "../context/DispatchContext";

const socket = io("http://localhost:8080");

const Chat = () => {
  const {
    isChatOpen,
    user: { username: currentUser, avatar: currentUserAvatar, token },
  } = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const chatField = useRef(null);
  const chatLog = useRef(null);
  const [state, setState] = useImmer({
    chatFieldValue: "",
    chatMessages: [],
  });

  const { chatFieldValue, chatMessages } = state;

  useEffect(() => {
    if (isChatOpen) {
      chatField.current.focus();
      appDispatch({ type: "clearUnreadChatCount" });
    }
  }, [isChatOpen]);

  useEffect(() => {
    socket.on("chatFromServer", (message) =>
      setState((draft) => {
        draft.chatMessages.push(message);
      })
    );
  }, []);

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
    if (chatMessages.length && !isChatOpen)
      appDispatch({ type: "incrementUnreadChatCount" });
  }, [chatMessages]);

  const handleChatFieldChange = (event) => {
    const value = event.target.value;
    setState((draft) => {
      draft.chatFieldValue = value;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    socket.emit("chatFromBrowser", { message: chatFieldValue, token });
    setState((draft) => {
      draft.chatMessages.push({
        message: draft.chatFieldValue,
        username: currentUser,
        avatar: currentUserAvatar,
      });
      draft.chatFieldValue = "";
    });
  };

  return (
    <div
      id="chat-wrapper"
      className={classNames(
        "chat-wrapper",
        { "chat-wrapper--is-visible": isChatOpen },
        "shadow",
        "border-top",
        "border-left",
        "border-right"
      )}
    >
      <div className="chat-title-bar bg-primary">
        <span>
          <i className="fas fa-users"></i> Group Chat
        </span>
        <span
          className="chat-title-bar-close"
          title="Close Chat"
          onClick={() => appDispatch({ type: "closeChat" })}
        >
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {chatMessages.map((message, index) => {
          const { username, avatar, message: chatMessage } = message;
          if (username == currentUser) {
            return (
              <div className="chat-self" key={index}>
                <div className="chat-message">
                  <div className="chat-message-inner">{chatMessage}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={avatar} />
              </div>
            );
          }
          return (
            <div className="chat-other" key={index}>
              <Link to={`/profile/${username}`}>
                <img className="avatar-tiny" src={avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${username}`}>
                    <strong>{username}</strong>
                  </Link>
                  : {chatMessage}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form
        id="chatForm"
        className="chat-form border-top"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
          ref={chatField}
          onChange={handleChatFieldChange}
          value={chatFieldValue}
        />
      </form>
    </div>
  );
};

export default Chat;
