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

Beer.prototype.create = function(postData, callback) {

  var self = this;

  self.InvalidateCache(function() {
    var beer = new self.Beer(postData);
    beer.save(callback);
  });
};

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

Beer.prototype.remove = function(beerName, callback) {

  var self = this;

  self.InvalidateCache(function() {
    self.Beer.remove({ name: beerName }, callback);
  });
};

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

module.exports = Beer;