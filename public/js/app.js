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
.controller('DashCtrl', ['$scope', function($scope) {
  $scope.calls = [123,456].map(function(num) { return {number:num}; });
}])
.controller('CallCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
  $scope.call = {
    number: $routeParams.number
  };
}]);