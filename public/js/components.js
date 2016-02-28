var LOC_RATE = 5000;

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
})
.directive('mapPos', function() {
  return {
    restrict: 'E',
    scope: {
      lat: '=',
      lng: '='
    },
    templateUrl: '/partials/mapPos.html',
    controller: ['$scope', '$q', '$http', '$timeout', function($scope, $q, $http, $timeout) {
      //FIXME DRY this from app.js
      
      var everything = function() {
        
        var marker, map;
        $scope.$watchCollection('[lat, lng]', function(nvs, ovs) {
          console.log(nvs, ovs);
          if(nvs[0] === void 0) return;
          var pos = {lat: $scope.lat, lng: $scope.lng};
          if(!marker) {
            new google.maps.Marker({
              position: pos,
              map: map,
              title: 'Caller Position'
            })
            map.setZoom(17);
          }
          var mappos = new google.maps.LatLng(pos.lat, pos.lng);
          marker.setPosition(mappos);
          map.panTo(mappos);
        });
        
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 1,
          center: {lat: 0, lng: 0}
        });
      };
      
      if(mapInitted) everything();
      else mapInitted = everything;
    }]
  }
});

//hack to get google maps to work with angular
var mapInitted;

function initMap() {
  if(mapInitted) mapInitted();
  else mapInitted = true;
}

var timeFn;

setInterval(function() {
  timeFn && timeFn();
}, 1000);