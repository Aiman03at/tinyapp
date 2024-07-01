
//// function to check if the email is already registered
/**
 * Function to check if email is already present in the users object
 * @param {string} email - The email to check for existence
 * @param {object} users - The users object to check against
 * @returns {boolean} - Returns true if email exists, otherwise false
 */


function getUserByEmail(email, users) {
  for (const key of Object.keys(users)) {
    
    if (users[key].email === email) {
      
      return users[key];

    }
    
  }
  return undefined;
}



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

// Function to filter URLs for a specific user

function urlsForUser(id, urlDatabase) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
}



module.exports = { getUserByEmail, generateRandomString, urlsForUser };