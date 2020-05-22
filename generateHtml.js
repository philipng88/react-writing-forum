import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter as Router } from "react-router-dom";
import fs from "fs";
import Header from "./src/components/Header/Header";
import Footer from "./src/components/Footer";
import LoadingIcon from "./src/components/LoadingIcon";
import StateContext from "./src/context/StateContext";

const Shell = () => (
  <StateContext.Provider value={{ loggedIn: false }}>
    <Router>
      <Header staticEmpty />
      <div className="py-5 my-5 text-center">
        <LoadingIcon />
      </div>
      <Footer />
    </Router>
  </StateContext.Provider>
);

const html = (content) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <title>The Mighty Pen</title>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Public+Sans:300,400,400i,700,700i&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
        integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
        crossorigin="anonymous"
      />
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css" 
        integrity="sha256-h20CPZ0QyXlBuAw7A+KluUYx/3pK+c7lYEpqLTlxjYQ=" 
        crossorigin="anonymous"
      />
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="stylesheet" href="/css/core.css" />
      <link rel="stylesheet" href="/css/avatar.css"/>
      <link rel="stylesheet" href="/css/chat.css"/>
      <link rel="stylesheet" href="/css/form.css"/>
      <link rel="stylesheet" href="/css/search.css"/>
      <link rel="stylesheet" href="/css/validation.css"/>
    </head>
    <body>
      <div id="app">${content}</div>
    </body>
  </html>
`;

const reactHtml = ReactDOMServer.renderToString(<Shell />);
const overallHtmlString = html(reactHtml);
const fileName = "./src/index-template.html";
const stream = fs.createWriteStream(fileName);

stream.once("open", () => stream.end(overallHtmlString));
