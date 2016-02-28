const config = require('../config.js');

const _ = require('lodash');
const express = require('express');
const router = express.Router();

const calls = {};
//API endpoints for responders and callers

router.get('/test', function(req, res) {
  res.end('test');
});

/*setInterval(function() {
  console.log(calls);
}, 5000);*/

//What a Terrible Failure
function wtf(res, status) {
  res.status(status || 400).json({
    success: false,
    error: 'wot r u doin'
  });
}
//registers a new call with the system
function beginCall(body) {
  const num = body.number;
  const call = calls[num] = {
    number: num,
    data: body.data || {},
    time: +new Date,
    pump: _.debounce(function() {
      //if our call is gone, quit
      if(calls[num] !== call) return;
      endCall(num, 'Connection timed out.');
    }, config.TIMEOUT)
  };
  call.pump();
  return { success: true };
}
//removes a call from the system
function endCall(num, reason) {
  if(!calls[num]) return;
  calls[num].pump.cancel();
  delete calls[num];
  return { success: true };
}
//initiate a call
router.post('/911', function(req, res) {
  var body = req.body;
  var num = body.number;
  if(!num || calls[num]) return wtf(res);
  res.json(beginCall(body));
});
//keep a call alive
router.post('/heartbeat', function(req, res) {
  var num = req.body.number;
  if(!num || !calls[num]) return wtf(res);
  //if there's a reason, they're ending rather than continuing
  if(req.body.reason) return res.json(endCall(req.body.reason));
  calls[num].pump();
  res.json({success: true});
});
//require auth token for this area
router.use('/auth/*', function(req, res, next) {
  if(req.body.token !== config.API_TOKEN) return wtf(res, 401);
  next();
});
//list of active calls
router.post('/auth/calls', function(req, res) {
  res.json({
    success: true,
    calls: Object.keys(calls).map(function(number) {
      return {
        number: number,
        time: calls[number].time
      };
    })
  });
});
//specific data on a single call
router.post('/auth/call', function(req, res) {
  const call = calls[req.body.number];
  if(!call) return wtf(res);
  res.json({
    success:true,
    call: _.omit(call,['pump'])
  });
});

module.exports = router;