const express = require('express');
//import axios from 'axios';
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    //console.log(username);
    //console.log(password);
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  //const filteredBooks = Object.keys(books)
  //  .filter(key => key == isbn)
  //  .map(key => books[key]);
  const filteredBooks = books[isbn];
  res.send(JSON.stringify(filteredBooks,null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(book => book.author === author);
  res.send(JSON.stringify(filteredBooks,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const filteredBooks = Object.values(books).filter(book => book.title === title);
    res.send(JSON.stringify(filteredBooks,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const filteredReviews = books[isbn].reviews;
  res.send(JSON.stringify(filteredReviews,null,4));
});

//  Get book review
public_users.get('/users/',function (req, res) {
    //Write your code here
    res.send(JSON.stringify(users,null,4));
});

public_users.get('/books-async', async function (req, res) {
    const response = await axios.get('https://inakisanchez-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/');
    const data = response.data;
    //console.log("LogData: " + JSON.stringify(data, null, 4));
    res.send(JSON.stringify(data,null,4));
});

public_users.get('/isbn-async/:isbn',async function (req, res) {
    const isbn = req.params.isbn;
    const response = await axios.get('https://inakisanchez-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/' + isbn);
    const data = response.data;
    //console.log("LogData: " + JSON.stringify(data, null, 4));
    res.send(JSON.stringify(data,null,4));
});

public_users.get('/author-async/:author',async function (req, res) {
    const author = req.params.author;
    const response = await axios.get('https://inakisanchez-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/' + author);
    const data = response.data;
    //console.log("LogData: " + JSON.stringify(data, null, 4));
    res.send(JSON.stringify(data,null,4));
});

public_users.get('/title-async/:title',async function (req, res) {
    const title = req.params.title;
    const response = await axios.get('https://inakisanchez-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/' + title);
    const data = response.data;
    //console.log("LogData: " + JSON.stringify(data, null, 4));
    res.send(JSON.stringify(data,null,4));
});

module.exports.general = public_users;