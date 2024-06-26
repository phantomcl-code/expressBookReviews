const isNil = require('lodash/isNil');
const secret = require("./secret.js");

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    return !isNil(username) && typeof username === 'string' && username.trim() !== '';
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    const user = users.find(user => user.username === username && user.password === password);
    return !isNil(user);
}

let secretKey = secret.secretKey

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const { username, password } = req.body;

    if (!isValid(username) || !password) {
      return res.status(400).json({ message: "Username or password not provided" });
    }

    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // generate acceso token
    const accessToken = jwt.sign({  user: { username } }, 
                                    secretKey, 
                                    { expiresIn: '1h' }
                                  );

    // set token session
    req.session.accessToken = accessToken;

    return res.json({ message: "Login successful", accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    books[isbn].reviews[username] = review;

    return res.json({ message: "Review added/updated successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.user.username;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (books[isbn].reviews[username]) {
            delete books[isbn].reviews[username];
            return res.json({ message: "Review deleted successfully" });
        } else {
            return res.status(404).json({ message: "Review not found" });
    }

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
