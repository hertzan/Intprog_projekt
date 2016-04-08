
var tweetmapApp = angular.module('tweetmap', ['ngRoute','ngResource','ngMap']);


tweetmapApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'partials/home.html'
      }).
      when('/map', {
        templateUrl: 'partials/map.html',
        controller: 'MapCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);