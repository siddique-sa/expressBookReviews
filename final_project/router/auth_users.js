const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

users.push({ username: 'John', password: '123456' });
users.push({ username: 'Jane', password: 'password' });
users.push({ username: 'Jack', password: 'qwerty' });

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    return users.some(user => user.username === username && user.password === password);
}

const deleteReview = (isbn, username) => {
    var reviewDeleted
    for (const date in books[isbn].reviews) {
        if (books[isbn].reviews[date].username === username) {
          reviewDeleted = books[isbn].reviews[date];
          delete books[isbn].reviews[date];
        }
    }
    return reviewDeleted;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if(!isValid(username)){
        return res.status(208).json({message: "Invalid Login. User '" + username + "' doesn't exist" });
    }

    if(!authenticatedUser(username,password)){
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }

    let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
    console.log("Access token: " + accessToken);
    req.session.authorization = {accessToken,username};
    return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/", (req, res) => {
  //Write your code here
  const user = req.session.authorization.username;
  const isbn = req.body.isbn;
  const review = req.body.review;
  const currentDate = Date.now();
  console.log("Usuario autenticado: " + user);
  console.log("ISBN: " + isbn);
  console.log("Texto review: " + review);
  console.log("Timestamp: " + currentDate);

  deleteReview(isbn,user);

  books[isbn].reviews[currentDate] = {
    username: user,
    date: currentDate,
    review: review
  };

  console.log(JSON.stringify(books[isbn]));
  const newReview = books[isbn].reviews[currentDate];
  return res.status(200).json({message: "Review added successfully", reviewAdded: newReview});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    var reviewDeleted = deleteReview(isbn, username);

    if(reviewDeleted === undefined){
        return res.status(200).json({message: "No review to delete for user " + username + " in book " + isbn});
    } else{
        console.log(JSON.stringify(reviewDeleted));
        return res.status(200).json({message: "Review deleted successfully", review: reviewDeleted});
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;