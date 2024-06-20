//the following code allows us to make HTTP requests on port 8080.

const express = require('express');
const app = express();
const PORT = 8080;

///Database

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};


///Using express for routing


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});