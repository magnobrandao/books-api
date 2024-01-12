'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const booksApi = require('./routes/books');
const errorHandler = require('./middlewares/errorHandler');

// App
const app = express();
app.use(bodyParser.json())
app.use("/books", booksApi)
app.use(errorHandler)

app.listen(process.env.PORT);
console.log(`Running on http://0.0.0.0:${process.env.PORT}`);