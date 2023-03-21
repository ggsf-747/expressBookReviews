const express = require('express');
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
    return false
    }
}


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password){
      if (!doesExist(username)){
          users.push({"username":username, "password": password});
          return res.status(200).json({message: "User registered. Please login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
        }      
  }
  return res.status(404).json({message: "Unable to register User"});
});

// Get the book list available in the shop
function axiosBook(){
    return new Promise((resolve, reject) => {
        resolve(books);
    })
}


public_users.get('/',function (req, res) {
    //Write your code here
    axiosBook().then(
        (book) => res.send(JSON.stringify(book, null, 4)),
        (error) => res.send("denied")
    );
  //   return res.status(300).json({message: "Yet to be implemented"});
  });


// public_users.get('/',function (req, res) { // task1
//   //Write your code here
//   txt1 = res.send(JSON.stringify(books,null,4));
//   return txt1
// //   return res.status(300).json({message: "Yet to be implemented"});
// });

function axiosISBN(isbn){
    let book = books[isbn];
    return new Promise((resolve,reject)=>{
        if (book) {
            resolve(book);
        } else{
            rejected("Cannot find book");
        }
    })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) { //task 11
    //Write your code here
    const isbn = req.params.isbn;
    axiosISBN(isbn).then(
        (book) => res.send(JSON.stringify(book,null,4)),
        (error) => res.send(error)
    )
  //   return res.status(300).json({message: "Yet to be implemented"});
   });

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) { //task 11
//   //Write your code here
//   const ISBN = req.params.isbn;
//   txt1 = res.send(books[ISBN])
//   return txt1
// //   return res.status(300).json({message: "Yet to be implemented"});
//  });


function axiosAuthor(author){
    let answer = [];
    return new Promise((resolve,reject) =>{
        for (var isbn in books) {
            let book = books[isbn];
            if (book.author === author){
                answer.push(book);
            }
        }
        resolve(answer);
    })
}

public_users.get('/author/:author',function (req, res) { //task 12
    //Write your code here
    const author = req.params.author;
    axiosAuthor(author)
    .then(
        book => res.send(JSON.stringify(book, null, 4))
    );
});    



// Get book details based on author
// public_users.get('/author/:author',function (req, res) { //task 12
//   //Write your code here
//   let author1 = []
//   for(const [key,values] of Object.entries(books)){
//       const book = Object.entries(values);
//       for(let i = 0; i < book.length ; i++){
//           if(book[i][0] == "author" && book[i][1] == req.params.author){
//               author1.push(books[key]);
//           }
//       }
//   }
//   txt1 = res.send(author1);
//   return txt1;
// });

function axiosTitle(title){
    let answer = [];
    return new Promise((resolve,reject)=>{
        for (var isbn in books){
            let book = books[isbn];
            if(book.title === title){
                answer.push(book);
            }
        }
        resolve(answer)
    })
}

public_users.get('/title/:title', function(req,res) {
    const title = req.params.title;
    axiosTitle(title)
    .then(
        result => res.send(JSON.stringify(result,null,4))
    );
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) { //task 13
//   //Write your code here
//   let title1 = []
//   for(const [key,values] of Object.entries(books)){
//       const book = Object.entries(values);
//         for(let i = 0; i < book.length ; i++){
//             if(book[i][0] == "title" && book[i][1] == req.params.title){
//               title1.push(books[key]);
//              }
//         }
//     }
//     txt1 = res.send(title1);
//     return txt1; 
// });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  txt1 = res.send(books[ISBN].reviews)
  return txt1
//   return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
