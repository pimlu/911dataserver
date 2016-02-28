var UPDATE_RATE = 2000;

function getToken() {
  return localStorage.token;
}

angular.module('app', ['ngRoute', 'components'])
.config(function($routeProvider) {
  //create our 'pages' and associate controllers with them
  $routeProvider
  .when('/', {
    templateUrl: '/partials/dash.html',
    controller: 'DashCtrl'
  })
  .when('/call/:number', {
    templateUrl: '/partials/call.html',
    controller: 'CallCtrl'
  });
})
//controllers for each main section of our app
.controller('AppCtrl', ['$scope', function($scope) {
}])
.controller('DashCtrl', ['$scope', '$http', '$timeout', '$q',
  function($scope, $http, $timeout, $q) {
  var cancel, callt;
  //once per UPDATE_RATE, make an http request to monitor the call list
  var callfn = function() {
    cancel = $q.defer();
    callt = $timeout(UPDATE_RATE);
    var req = $http.post('/api/auth/calls', {
      token: getToken()
    }, { timeout: cancel }).then(function(res) {
      $scope.calls = res.data.calls;
    });
    $q.all([callt, req]).then(callfn);
  };
  callfn();
  $scope.calls = null;
  //cancel requests/timers
  $scope.$on('destroy', function(evt) {
    $timeout.cancel(callt);
    cancel && cancel.resolve();
  });
}])
.controller('CallCtrl', ['$scope', '$routeParams', '$http', '$q',
  function($scope, $routeParams, $http, $q) {
  var number = $routeParams.number;
  $scope.call = { number: number };
  var cancel = $q.defer();
  //TODO updates?
  var req = $http.post('/api/auth/call', {
    token: getToken(),
    number: number
  }, { timeout: cancel }).then(function(res) {
    $scope.call.data = res.data.data;
  }, function(e) {
    $scope.call.fail = e.status <= 0 ? 'The requested call couldn\'t be loaded.' :
      `The number ${number} doesn't have an active session with the server.`;
  });
  
  $scope.$on('destroy', function(evt) {
    cancel && cancel.resolve();
  });
}]);