'use strict';

var app = angular.module('PiMonitor', ['ngResource']);

app.controller('StatCtrl', ['$scope', 'StatService', '$timeout', function($scope, statService, $timeout){
  
  (function tick(){
    var newData = statService.get(function(){
      $scope.statData = newData;
    });
    $timeout(tick, 2000);
  })();
}]);

app.service('StatService', ['$resource', function($resource){
  return $resource('stats', {}, {
    get: {method: 'GET'}
  })
}]);