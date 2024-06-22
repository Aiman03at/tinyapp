//the following code allows us to make HTTP requests on port 8080.

const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
///This tells the Express app to use EJS as its templating engine.
app.set("view engine", "ejs");

///To make this data readable, we will need to use another piece of middleware which will translate, or parse the body.
app.use(express.urlencoded({ extended: true }));

///Database

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

///a function that returns a string of 6 random alphanumeric characters:
/**
 * @returns---6 digit alphanumeric character
 */

  function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    let randomString = '';
    
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }
    
    return randomString;
  }


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
// add a new a GET route to render the urls_new.ejs template (given below) in the browser, to present the form to the user;
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
///Adding a Second Route and Template
///The end point for such a page will be in the format /urls/:id. The : in front of id indicates that id is a route parameter.
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});



////Post method to redirect to the shortURL
app.post("/urls", (req, res) => {
  console.log(req.body.longURL); // Log the POST request body to the console
  let random =generateRandomString();
  console.log(random);
  urlDatabase[random] = req.body.longURL;
  res.redirect(`/urls/${random}`); // Redirect to the short uRL
  
});


app.get("/u/:id", (req, res) => {
  let id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

////Post method to delete an entry

app.post("/urls/:id/delete",(req,res)=>{
  let id = req.params.id;
  delete urlDatabase[id];
  res.redirect('/urls')
})

// Post method to update a URL entry
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const newLongURL = req.body.longURL;
  urlDatabase[id] = newLongURL;
  res.redirect('/urls');
});

///POST method for Login
app.post("/login",(req,res)=>{
  const uname = req.body.username;
  res.cookie('username',uname);
  console.log(uname);
  res.redirect('/urls');
})