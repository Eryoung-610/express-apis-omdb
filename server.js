require('dotenv').config();
const express = require('express');
const axios = require('axios')
const ejsLayouts = require('express-ejs-layouts');
const app = express();

// Sets EJS as the view engine
app.set('view engine', 'ejs');
// Specifies the location of the static assets folder
app.use(express.static('static'));
// Sets up body-parser for parsing form data
app.use(express.urlencoded({ extended: false }));
// Enables EJS Layouts middleware
app.use(ejsLayouts);

// Adds some logging to each request
app.use(require('morgan')('dev'));

// Routes
app.get('/', function(req, res) {
  res.render('home');
});

app.get('/results', (req,res) => {
  let title = req.query.title;
  axios.get(`http://www.omdbapi.com/?apikey=${process.env.API_KEY}&s=` + title)
  .then(response => {
    let result = response.data.Search
    let resultData = {
      title: result.Title,
      year: result.Year,
      poster: result.Poster,
      imdbID: result.imdbID
    }

    res.render('results', {result})
    // console.log(movies.length)
  }).catch(err => {
    res.send(err)
  })
})

app.get('/detail/:movie_id', (req,res) => {
  let id = req.params.movie_id
  axios.get(`http://www.omdbapi.com/?apikey=${process.env.API_KEY}&i=` + id).then (response => {
    let result = response.data
    let resultData = {
      title: result.Title,
      year: result.Year,
      poster: result.Poster,
      imdbID: result.imdbID
    }
    res.render('detail', {resultData})
  })
})

// The app.listen function returns a server handle
var server = app.listen(process.env.PORT || 3000);

// We can export this server to other servers like this
module.exports = server;
