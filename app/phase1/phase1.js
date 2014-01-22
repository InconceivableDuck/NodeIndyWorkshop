var express = require('express'),
    app = express()

app.get('/', function(req, res) {
  res.send('Welcome to Node.Indy!')
});

app.listen(process.env.PORT || 8080);