//the following code allows us to make HTTP requests on port 8080.

const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(cookieParser())
// Middleware to parse request bodies
//app.use(bodyParser.urlencoded({ extended: true }));
///This tells the Express app to use EJS as its templating engine.
app.set("view engine", "ejs");

///To make this data readable, we will need to use another piece of middleware which will translate, or parse the body.
app.use(express.urlencoded({ extended: true }));

////An array to create users///

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

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

//// function to check if the email is already registered

/**
 * Function to check if email is already present in the users object
 * @param {string} email - The email to check for existence
 * @param {object} users - The users object to check against
 * @returns {boolean} - Returns true if email exists, otherwise false
 */
function getUserByemail(email, users) {
  for (const key of Object.keys(users)) {
    if (users[key].email === email) {
      return true;
    }
    
  }
  return false;
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
  const user_id = req.cookies.user_id; ;
  
  const user = users[user_id] ;
  
  const templateVars = { user : user, urls: urlDatabase , user_id : user_id};
  res.render("urls_index", templateVars);
});
// add a new a GET route to render the urls_new.ejs template (given below) in the browser, to present the form to the user;
app.get("/urls/new", (req, res) => {
  const user_id = req.cookies.user_id; ;
  const user = users[user_id] ;
  const id = req.params.id;
 const templateVars ={id :id ,user_id :user_id ,user : user}
  res.render("urls_new",templateVars);
});
///Adding a Second Route and Template
///The end point for such a page will be in the format /urls/:id. The : in front of id indicates that id is a route parameter.
app.get("/urls/:id", (req, res) => {
  const user_id = req.cookies.user_id; ;
  const user = users[user_id] ;
  const templateVars = { user : user, id: req.params.id, longURL: urlDatabase[req.params.id],user_id : user_id};
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
  const id = req.params.id;
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
  
  const email =req.body.email;
  const password = req.body.password;
  if (getUserByemail(email,users)) {
    for ( const key of Object.keys(users)) {
      //const user = users[key];
      console.log(users[key]);
      console.log(users[key].email)
      console.log(users[key].password);
      if ( users[key].password === password) {
        res.cookie('user_id',users[key].id);
        
        res.redirect("/urls");
    } 
  }
  
    return res.status(403).json({error:'Password not matching'})
  
    
  } else {
    return res.status(403).json({ error: 'Email is not matching' });
  }
  
  
})

app.get("/login",(req,res)=>{
  //const user_id = req.cookies.user_id; 
  const user_id = null;
  templateVars = {user_id : user_id}
  res.render("login", templateVars)
  
})

app.post("/logout",(req,res)=>{
  
})
////
app.get("/logout",(req,res)=>{
  res.clearCookie("user_id");
  res.redirect("/login");
  
 
})

/////Create a post request for register

app.post("/register",(req,res)=>{
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  const user = {id, email, password};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  if (getUserByemail(email,users)) {
    return res.status(400).json({error : 'Email already registered'});
  }
  
  users[id] = user;
  //res.cookie('user_id',id);
  res.redirect("/login");
  
})



app.get("/register", (req, res) => {
  
  const user_id = null;
 
  const templateVars = { urls: users , user_id: user_id};

  res.render("register", templateVars);
});


