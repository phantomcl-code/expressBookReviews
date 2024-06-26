const isNil = require('lodash/isNil');

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const { username, password } = req.body;

    if (!isValid(username) || !password) {
        return res.status(400).json({ message: "Username or password not provided" });
    }

    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const response = [];

    if(isNil(author)) {
        res.status(400).send("author is null or undefined");
    }

    for (let id in books) {
        if (books[id].author.toLowerCase() === author.toLowerCase()) {
            response.push(books[id]);
        }
    }

    if (!isNil(response) && response.length > 0) {
        res.send(response);

    } else {
        res.status(404).send("Author not found");
    }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const response = [];

    if(isNil(title)) {
        res.status(400).send("title is null or undefined");
    }

    for (let id in books) {
        if (books[id].title.toLowerCase() === title.toLowerCase()) {
            response.push(books[id]);
        }
    }

    if (!isNil(response) && response.length > 0) {
        res.send(response);

    } else {
        res.status(404).send("Title not found");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (!isNil(books[isbn])) {
      res.json(books[isbn].reviews);

  } else {
      res.status(404).send("isbn not found");
  }
});

module.exports.general = public_users;
