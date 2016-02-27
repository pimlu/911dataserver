var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json()); 
app.set('view engine', 'jade');

require('./src/routes.js')(app);

var server = app.listen(8080, 'localhost', function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('listening at http://%s:%s', host, port);
});