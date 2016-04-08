tweetmapApp.controller('MapCtrl', function ($scope, NgMap) {
	var myMap = this;
	$scope.placeChanged = function() {
		myMap.place = this.getPlace();
		console.log('location', myMap.place.geometry.location.lat());
		myMap.map.setCenter(myMap.place.geometry.location);
	}
	NgMap.getMap().then(function(map) {
		myMap.map = map;
	});
});