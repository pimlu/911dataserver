angular.module('components', [])
//shows list of active calls
.directive('activeCalls', function() {
  return {
    restrict: 'E',
    scope: {
      calls: '='
    },
    templateUrl: '/partials/activeCalls.html',
    controller: ['$scope', '$location', function($scope, $location) {
      //can't use href on a tr so this will have to do
      $scope.gotoCall = function(number) {
        $location.url(`/call/${number}`);
      };
    }]
  };
})
//globally steps all the timers in sync using a single interval
//keeps tracks of all the timer scopes and periodically digests them
.directive('minTimer', function() {
  var curid=0;
  var scopes = {};
  timeFn = function() {
    var keys = Object.keys(scopes);
    for(var i=0; i<keys.length; i++) {
      scopes[keys[i]].$digest();
    }
  };
  return {
    restrict: 'E',
    scope: {
      time: '='
    },
    templateUrl: '/partials/minTimer.html',
    controller: function($scope) {
      var id = curid++;
      scopes[id] = $scope;
      $scope.timeFmt = function() {
        var t = +new Date, dt = t-$scope.time;
        var ds = dt/1000, dm = ds/60;
        var m = dm |0, s = ds%60 |0;
        return `${m}:${(''+s).length-1?s:'0'+s}`;
      };
      $scope.$on('destroy', function(evt) {
        delete scopes[id];
      });
    }
  };
});

var timeFn;

setInterval(function() {
  timeFn && timeFn();
}, 1000);