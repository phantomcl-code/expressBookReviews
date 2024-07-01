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
public_users.get('/',async function (req, res) {
    //Write your code here
    try {
        const response = await new Promise((resolve, reject) => {
            resolve(JSON.stringify(books));
        });
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ error: 'Error listing books' });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

    try {
        const response = await new Promise((resolve, reject) => {
            resolve(books[isbn]);
        });
        res.send(response)

    } catch (error) {
        res.status(500).json({ error: 'Error getting book detail' });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;
  const response = [];

    if(isNil(author)) {
        res.status(400).send("author is null or undefined");
    }


    try {
        const response = await new Promise((resolve, reject) => {
            const result = [];
            for (let id in books) {
                if (books[id].author.toLowerCase() === author.toLowerCase()) {
                    result.push(books[id]);
                }
            }
            if (result.length > 0) {
                resolve(result);
            }
        });


        if (!isNil(response) && response.length > 0) {
            res.send(response);
    
        } else {
            res.status(404).send("Author not found");
        }

    } catch (error) {
        res.status(500).json({ error: 'Error getting book detail' });
    }

});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title = req.params.title;

    if(isNil(title)) {
        res.status(400).send("title is null or undefined");
    }
    try {
        const response = await new Promise((resolve, reject) => {
            const result = [];
            for (let id in books) {
                if (books[id].title.toLowerCase() === title.toLowerCase()) {
                    result.push(books[id]);
                }
            }
            
            if (result.length > 0) {
                resolve(result);
            }
        });

        if (!isNil(response) && response.length > 0) {
            res.send(response);

        } else {
            res.status(404).send("Title not found");
        }
        
    } catch (error) {
        res.status(500).json({ error: 'Error getting book detail' });
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
