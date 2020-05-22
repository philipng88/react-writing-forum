const express = require("express");
const path = require("path");
const app = new express();
const port = 4000;
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => res.sendFile(__dirname + "/dist/index.html"));
app.listen(port, () =>
  console.log(`Distribution preview is running on port ${port}`)
);
