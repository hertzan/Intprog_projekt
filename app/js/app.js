
var tweetmap = angular.module('tweetmap', ['ngRoute','ngResource']);


tweetmap.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'partials/map.html'
      }).
      when('/map', {
        templateUrl: 'partials/map.html',
        controller: 'mapCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);