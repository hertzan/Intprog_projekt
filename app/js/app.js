
var tweetmapApp = angular.module('tweetmap', ['ngRoute','ngResource','ngMap','angular.filter']);


tweetmapApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'partials/home.html'
      }).
      when('/search', {
        templateUrl: 'partials/search.html',
        controller: 'SearchCtrl'
      }).
      when('/map', {
        templateUrl: 'partials/map.html',
        controller: 'MapCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);