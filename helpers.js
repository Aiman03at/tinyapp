
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
      console.log(key);
      return key;

    }
    
  }
  return undefined;
}




module.exports = getUserByemail;