var Beer = function(mongoose) {
  // Define Schema.
  this.BeerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String },
    domestic: { type: Boolean },
    rating: { type: Number }
  });

  this.Beer = mongoose.model('Beer', this.BeerSchema);
};

Beer.prototype.create = function(postData, callback) {
  var beer = new this.Beer(postData);
  beer.save(callback);
};

Beer.prototype.get = function(callback) {
  this.Beer.find(callback);
};

Beer.prototype.remove = function(beerName, callback) {
  this.Beer.remove({ name: beerName }, callback);
};

module.exports = Beer;