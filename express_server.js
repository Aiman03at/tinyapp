//the following code allows us to make HTTP requests on port 8080.

const express = require('express');
const app = express();
const PORT = 8080;
///This tells the Express app to use EJS as its templating engine.
app.set("view engine", "ejs");

///Database

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};


///Using express to create a server


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


////Add Routing

app.get("/urls.json",(req,res) =>{
res.json(urlDatabase);

})


////Sending Html to the app

app.get("/hello",(req,res) =>{

  res.send("<html><body>Hello <b>World</b></body></html>\n")

})

///accessing a variable sent in one request from another request
//a cannot be accessed through fetch

/*app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});
*/
/////add a new route handler for "/urls" and use res.render() to pass the URL data to our template.
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

///Adding a Second Route and Template
///The end point for such a page will be in the format /urls/:id. The : in front of id indicates that id is a route parameter.
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: 'http://www.lighthouselabs.ca' };
  res.render("urls_show", templateVars);
});