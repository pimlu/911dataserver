var express = require('express');
var router = express.Router();

var calls = {};

//API endpoints for responders and callers

router.get('/test', function(req, res) {
  res.end('test');
});

router.post('/911', function(req, res) {
  var body = req.body;
  var num = body.number;
  if(calls[num]) {
    clearTimeout(calls[num].tid);
    delete calls[num];
  }
  
});

module.exports = router;