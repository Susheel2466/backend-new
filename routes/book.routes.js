const bookController = require('../controller/book.controller');
const express = require("express");
const app = express();
const route = express.Router();


route.post("/insert_book", bookController.insertBook);
route.get("/book_list", bookController.getBookList);

module.exports = route;