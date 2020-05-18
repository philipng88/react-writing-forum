import React from "react";
import ReactTooltip from "react-tooltip";
import Page from "../../components/Page";

const ViewSinglePost = () => {
  return (
    <Page>
      <div className="d-flex justify-content-between">
        <h2>Example Post Title</h2>
        <span className="pt-2">
          <a
            href="#"
            className="text-primary mr-2"
            data-tip="Edit"
            data-for="editIcon"
          >
            <i className="fas fa-edit"></i>
          </a>
          <a
            href="#"
            className="text-danger delete-post-button"
            data-tip="Delete"
            data-for="deleteIcon"
          >
            <i className="fas fa-trash"></i>
          </a>
        </span>
      </div>
      <p className="text-muted small mb-4">
        <a href="#">
          <img
            src="https://randomuser.me/api/portraits/lego/1.jpg"
            alt="Avatar"
            className="avatar-tiny"
          />
        </a>
        Posted by <a href="#">brad</a> on 2/10/2020
      </p>
      <div className="body-content">
        <p>
          Lorem ipsum dolor sit <strong>example</strong> post adipisicing elit.
          Iure ea at esse, tempore qui possimus soluta impedit natus voluptate,
          sapiente saepe modi est pariatur. Aut voluptatibus aspernatur fugiat
          asperiores at.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae quod
          asperiores corrupti omnis qui, placeat neque modi, dignissimos, ab
          exercitationem eligendi culpa explicabo nulla tempora rem? Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Iure ea at esse, tempore
          qui possimus soluta impedit natus voluptate, sapiente saepe modi est
          pariatur. Aut voluptatibus aspernatur fugiat asperiores at.
        </p>
      </div>
      <ReactTooltip id="editIcon" effect="solid" />
      <ReactTooltip id="deleteIcon" effect="solid" />
    </Page>
  );
};

export default ViewSinglePost;
