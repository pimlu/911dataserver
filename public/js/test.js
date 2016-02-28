$(function() {
  var interval;
  function post(url, obj, succeed) {
    $.ajax(url, {
      data : JSON.stringify(obj),
      contentType : 'application/json',
      type : 'POST',
      succeed: succeed
    });
  }
  
  $('#call').click(function() {
    post('/api/911', {
      number: $('#number').val(),
      data: {
        name: 'stubot'
      }
    });
    clearInterval(interval);
    interval = setInterval(function() {
      post('/api/heartbeat', {
        number: $('#number').val(),
        "lat":37.23,
        "lng":-80.4177778
      });
    }, 5000);
  });
  $('#end').click(function() {
    post('/api/heartbeat', {
      number: $('#number').val(),
      reason: 'end'
    });
    clearInterval(interval);
  });
});