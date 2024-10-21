const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return users.filter((user) => user.username === username).length < 1;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return (
    users.filter(
      (user) => user.username === username && user.password === password
    ).length > 0
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  const accessToken = jwt.sign({ username, password }, "access", {
    expiresIn: 60 * 60,
  });

  req.session.authorization = { accessToken, username };
  return res.status(200).json({ message: "User logged in" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.session.authorization.username;

  if (!review) {
    return res.status(400).json({ message: "Please provide a review" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added successfully" });
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
