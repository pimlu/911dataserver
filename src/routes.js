var express = require('express');
var api = require('./api.js');

module.exports = function(app) {
  
  //sets up all of our main routes
  
  app.use(express.static('public'));
  app.use('/lib', express.static('bower_components'));
  
  //delegate api routing to api.js
  app.use('/api', api);
  
  app.get('/', function(req, res) {
    res.render('home', {});
  });
  app.get('/partials/:name.html', function(req, res) {
    res.render(`partials/${req.params.name}`);
  });
  
  app.post('/', function(req, res) {
    res.render('home', {});
  });
  
  
};