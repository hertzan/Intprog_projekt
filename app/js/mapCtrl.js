tweetmap.controller('mapCtrl', function ($scope,MapHack) {

  $scope.numberOfGuests = MapHack.getNumberOfGuests();
  $scope.Menu = MapHack.getFullMenu();

});