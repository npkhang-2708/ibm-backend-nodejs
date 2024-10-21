const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password" });
  }

  const usernameExists = users.filter((user) => user.username === username);

  if (!isValid(username)) {
    return res.send("User already exists, please try another username");
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User created successfully" });
});

// Get the book list available in the shop
const getAllBooks = async () => {
  try {
    const res = await axios.get("http://localhost:5000/");
    console.log(res.data);
  } catch (error) {
    console.error(error);
  }
};

// getAllBooks();

public_users.get("/", (req, res) => {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
const getBookByISBN = async (isbn) => {
  try {
    const res = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(res.data);
  } catch (error) {
    console.error(error);
  }
};

// getBookByISBN("1");

public_users.get("/isbn/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  }

  return res.status(404).json({ message: "Book not found" });
});

// Get book details based on author
const getBookByAuthor = async (author) => {
  try {
    const res = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(res.data);
  } catch (error) {
    console.error(error);
  }
};

// getBookByAuthor("Chinua Achebe");

public_users.get("/author/:author", (req, res) => {
  //Write your code here
  const { author } = req.params;
  const book = Object.values(books).filter((book) => book.author === author);

  if (book) {
    return res.status(200).json(book);
  }

  return res.status(404).json({ message: "Book not found" });
});

// Get all books based on title
const getBookByTitle = async (title) => {
  try {
    const res = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(res.data);
  } catch (error) {
    console.error(error);
  }
};

getBookByTitle("One Thousand and One Nights");

public_users.get("/title/:title", (req, res) => {
  //Write your code here
  const { title } = req.params;
  const book = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title.toLowerCase()
  );

  if (book) {
    return res.status(200).json(book);
  }

  return res.status(404).json({ message: "Book not found" });
});

//  Get book review
public_users.get("/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const review = Object.values(books[isbn].reviews);

  if (review) {
    return res.status(200).send(JSON.stringify(review, null, 4));
  }

  return res.status(404).json({ message: "Review not found" });
});

module.exports.general = public_users;
