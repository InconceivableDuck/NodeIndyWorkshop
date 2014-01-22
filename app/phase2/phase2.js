var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    Beer = require('./beer'),
    beer = new Beer(mongoose);

// Connect to MongoDB.
mongoose.connect('mongodb://107.170.4.85/brandon-cannaday');

// Handles parsing the body.
app.use(express.json());

app.get('/', function(req, res) {
  res.send('Welcome to Node.Indy!')
});

app.post('/beer', function(req, res) {

  beer.create(req.body, function(err, result) {
    if(err) {
      res.send(500, err.toString());
    }
    else {
      res.send(result);
    }
  });
});

app.get('/beer', function(req, res) {
  
  beer.get(function(err, result) {
    if(err) {
      res.send(500, err.toString());
    }
    else {
      res.send(result);
    }
  });
});



app.delete('/beer/:name', function(req, res) {

  beer.remove(req.params.name, function(err) {
    if(err) {
      res.send(500, err.toString());
    }
    else {
      res.send(200);
    }
  });
});

app.listen(process.env.PORT || 8080);