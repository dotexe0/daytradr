var express = require('express');
var app = express();
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.send('Hello world');
})
app.listen(process.env.PORT || 8080);
console.log('Server running @ localhost:8080');

exports.app = app;
