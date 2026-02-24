const express = require('express');
const app = express();
const morgan = require('morgan');
const Fruit = require('./models/fruit');
require('dotenv').config();
const methodOverride = require('method-override');
const fruitsController = require('./controllers/fruits.controller.js');

//middleware
//loads in mongodb connection
require('./db/connection');
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
//opt into using public or static files
app.use(express.static('public'));

//routes
app.get('/', (req, res) => {
  res.render('index.ejs');
});

//attach route / fruit controller to app
app.use(fruitsController);
// example extra routes
// app.use(userController);
// app.use(petsController);
// app.use(treatsController);
// app.use(adoptionsController);
// app.use(toysController);

//catch all
app.get('/*slug', (req, res) => {
  res.render('404.ejs', {message: 'The url you requested does not exist'})
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});