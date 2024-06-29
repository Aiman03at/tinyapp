//the following code allows us to make HTTP requests on port 8080.

const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const {getUserByemail} = require('./helpers')

//const cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs");
var cookieSession = require('cookie-session')


app.use(cookieSession({
  name: 'session',
  keys: ['user'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

//app.use(cookieParser())
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
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
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

  const user_id = req.session.user_id;
  
  
  
  const user = users[user_id] ;
  if(!user_id) {
    return res.status(403).send("Please login first")
  }
  
  const userUrls = urlsForUser(user_id);
  const templateVars = { user: users[user_id], urls: userUrls , urls: urlDatabase , user_id : user_id};
  
  res.render("urls_index", templateVars);
});
// add a new a GET route to render the urls_new.ejs template (given below) in the browser, to present the form to the user;
app.get("/urls/new", (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id] ;
  const id = req.params.id;
 const templateVars ={id :id ,user_id :user_id ,user : user}
 if (!user_id) {
  res.redirect("/login")
 }
 if(user_id) {
  res.render("urls_new",templateVars);
 }
});
///Adding a Second Route and Template
///The end point for such a page will be in the format /urls/:id. The : in front of id indicates that id is a route parameter.
app.get("/urls/:id", (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id] ;
  const id =req.params.id;
  const url = urlDatabase[id];
  if(!user_id) {
    return res.status(403).send("Please login to see the list");
  }
  if (!urlDatabase[id]) {
    return res.status(400).send("This Id does not exist");
  }

  if (!url) {
    return res.status(404).send("URL not found");
  }
  if (url.userID !== user_id) {
    return res.status(403).send("You do not have permission to view this URL");
  }
  const templateVars = { user : user, id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user_id : user_id};
  res.render("urls_show", templateVars);
});



////Post method to redirect to the shortURL
app.post("/urls", (req, res) => {
   // Log the POST request body to the console

   
  const user_id = req.session.user_id;
  
  const user = users[user_id] ;
  let random =generateRandomString();
  console.log(random);
  urlDatabase[random] = {
    longURL: req.body.longURL,
    userID: user_id
  };
  
  res.redirect(`/urls/${random}`); // Redirect to the short uRL
  
});



app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  if (urlDatabase[id]) {
  const longURL = urlDatabase[id].longURL;
  res.redirect(longURL);
  }
  else{
    return res.status(400).send("This Id does not exist");
  }
});

////Post method to delete an entry

app.post("/urls/:id/delete",(req,res)=>{
  const user_id = req.session.user_id;
  
  const user = users[user_id] ;
  const id =req.params.id;
  const url = urlDatabase[id];
  if(!user_id) {
    return res.status(403).send("Please login to see the list");
  }
  if (!urlDatabase[id]) {
    return res.status(400).send("This Id does not exist");
  }

  if (!url) {
    return res.status(404).send("URL not found");
  }
  if (urlDatabase[id].userID === user_id) {
  delete urlDatabase[id];
  res.redirect('/urls')
} else {
  res.status(403).send("You do not have permission to update this URL");
}
})

// Post method to update a URL entry
app.post("/urls/:id", (req, res) => {
  const user_id = req.session.user_id;
  const id = req.params.id;
  
  const user = users[user_id] ;
  
  const url = urlDatabase[id];
  if(!user_id) {
    return res.status(403).send("Please login to see the list");
  }
  if (!urlDatabase[id]) {
    return res.status(400).send("This Id does not exist");
  }

  if (!url) {
    return res.status(404).send("URL not found");
  }

  const newLongURL = req.body.longURL;
  if (urlDatabase[id].userID === user_id) {
    urlDatabase[id].longURL = newLongURL;
    res.redirect('/urls');
  } else {
    res.status(403).send("You do not have permission to update this URL");
  }
  
});

///POST method for Login
app.post("/login",(req,res)=>{
  
  const email =req.body.email;
  const password = req.body.password;
  
  if (getUserByemail(email,users)) {
   
      const found_user_id = getUserByemail(email,users);
      const found_user = users[found_user_id];
      
      if ( bcrypt.compareSync(found_user.password, password)) {
        //res.cookie('user_id',found_user_id);
        //set the session
        req.session.user_id = found_user_id;
        res.redirect("/urls");
     
       } else {
  
      return res.status(403).json({error:'Password not matching'})
  
       }
      }
   else {
    return res.status(403).json({ error: 'Email is not matching' });
  }
  
  
})
////get request to render login page

app.get("/login",(req,res)=>{
  //const user_id = req.cookies.user_id; 
  const user_id = null;
  templateVars = {user_id : user_id}
  res.render("login", templateVars)
  
})

////Post request to clear all cookies

app.get("/logout",(req,res)=>{
  //res.clearCookie("user_id");
  req.session['user_id'] = null;
  res.redirect("/login"); 
})


/////Create a post request for register

app.post("/register",(req,res)=>{
  const id = generateRandomString();
  const email = req.body.email;
  const password_unhashed = req.body.password;
  const password = bcrypt.hashSync(password_unhashed, 10);
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


