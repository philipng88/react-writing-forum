import React from "react";
import classNames from "classnames";

const Container = (props) => {
  return (
    <div
      className={classNames(
        "container",
        { "container--narrow": !props.wide },
        "py-md-5"
      )}
    >
      {props.children}
    </div>
  );
};

export default Container;
