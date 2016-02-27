angular.module('components', [])
//shows list of active calls
.directive('activeCalls', function() {
  return {
    restrict: 'E',
    scope: {
      calls: '='
    },
    templateUrl: '/partials/activeCalls.html',
    controller: function($scope) {
      
    }
  };
});