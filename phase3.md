# Phase 3
Caching Data to Redis.

Redis Host: 107.170.4.85 <br />
Redis Port: 6379 <br />
Redis DB: Last 4 digits of cell phone number

## Add Redis Dependency
https://npmjs.org/package/redis <br />

In package.json

```
"dependencies": {
  "express" : "3.4.x",
  "mongoose" : "3.8.x",
  "redis" : "0.10.x"
}
```

```
$ npm install
```

## Connect to Redis

In phase1.js:

```js
var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    redis = require('redis'),
    Beer = require('./beer');

// Connect to MongoDB.
mongoose.connect('mongodb://107.170.4.85/brandon-cannaday');
var redisClient = redis.createClient(6379, '107.170.4.85');
redisClient.select(5336); // Last 4 digits of cell phone

var beer = new Beer(mongoose, redisClient);
```

## Modify Beer Constructor
Change it to accept the redis client through the constructor.

```js
var Beer = function(mongoose, redisClient) {
    // Define Schema.
  this.BeerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String },
    domestic: { type: Boolean },
    rating: { type: Number }
  });

  this.Beer = mongoose.model('Beer', this.BeerSchema);
  this.redisClient = redisClient;
};
```

## Add Cache Functions

```js
Beer.prototype.getFromCache = function(callback) {
  this.redisClient.get('Beers', function(err, result) {
    if(err) {
      return callback(err);
    }

    if(result) {
      result = JSON.parse(result);
    }

    callback(null, result);
  });
}

Beer.prototype.updateCache = function(beers, callback) {
  this.redisClient.set('Beers', JSON.stringify(beers), callback);
}

Beer.prototype.InvalidateCache = function(callback) {
  this.redisClient.del('Beers', callback);
}
```

## Update Getter to Look in Cache
```js
Beer.prototype.get = function(callback) {

  var self = this;

  self.getFromCache(function(err, cache) {
    if(err) {
      return callback(err);
    }
    
    if(cache) {
      console.log('Results found in cache.');
      return callback(null, cache);
    }

    self.Beer.find(function(err, result) {
      if(err) {
        return callback(err);
      }

      self.updateCache(result, function(err) {
        callback(err, result);
      });
    });
  });
  
};
```

## Update Create/Remove to Invalidate Cache
```js
Beer.prototype.remove = function(beerName, callback) {

  var self = this;

  self.InvalidateCache(function() {
    self.Beer.remove({ name: beerName }, callback);
  });
};
```

```js
Beer.prototype.create = function(postData, callback) {

  var self = this;

  self.InvalidateCache(function() {
    var beer = new self.Beer(postData);
    beer.save(callback);
  });
};
```
