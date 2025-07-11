
const express = require('express');


const app = express();
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use(express.json());


const bookStuffRoutes = require('./Routes/bookStuff');
const userRoutes = require('./Routes/User');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://noahalpro:vSeXI5qtESn7SDPw@cluster0.du5olo2.mongodb.net/')
  .then(() => console.log(''))
  .catch(() => console.log('!'));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/books', bookStuffRoutes );
app.use('/api/auth', userRoutes);
module.exports = app;