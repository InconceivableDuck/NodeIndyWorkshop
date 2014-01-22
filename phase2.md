# Phase 2
Working with MongoDB and Mongoose.

MongoDB Connection String: mongodb://107.170.4.85/firstname-lastname

## Create Beer controller (beer.js).

Create a new file called beer.js. Create and export a contoller.

```js
var Beer = function(mongoose) {};

module.exports = Beer;
```


## Create Mongo Schema and Model

```js
var Beer = function(mongoose) {
  this.BeerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    domestic: { type: Boolean, required: true },
    rating: { type: Number, required: true }
  });

  this.Beer = mongoose.model('Beer', this.BeerSchema);
};
```

## Add function to get all beers

```js
Beer.prototype.get = function(callback) {
  this.Beer.find(callback);
};
```

## Add function to create new beer

```js
Beer.prototype.create = function(postData, callback) {
  var beer = new this.Beer(postData);
  beer.save(callback);
};
```

## Add function to remove beer
```js
Beer.prototype.remove = function(beerName, callback) {
  this.Beer.remove({ name: beerName }, callback);
};
```

## Add routes to Express app
```js
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
```
