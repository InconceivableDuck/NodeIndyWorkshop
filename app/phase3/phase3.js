var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    redis = require('redis'),
    Beer = require('./beer');

// Connect to MongoDB.
mongoose.connect('mongodb://107.170.4.85/brandon-cannaday');
var redisClient = redis.createClient(6379, '107.170.4.85');
redisClient.select(5336);

var beer = new Beer(mongoose, redisClient);

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