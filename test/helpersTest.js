const chai = require('chai'); // Fixing the import statement
const assert = chai.assert;

const  {getUserByEmail}  = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "[email1 protected]", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "[email2 protected]", 
    password: "dishwasher-funk"
  }
};


describe('getUserByEmail', function() {
  
  it('should return a user with valid email', function() {
    const user = getUserByEmail("[email1 protected]", testUsers)
    console.log(typeof(user));
    console.log(user);
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert.strictEqual(user, expectedUserID);
  });

  

});