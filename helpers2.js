// Function to filter URLs for a specific user

function urlsForUser(id, urlDatabase) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    console.log(shortURL);
    console.log(urlDatabase[shortURL]);
    if (urlDatabase[shortURL].userId === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
}



module.exports = urlsForUser;