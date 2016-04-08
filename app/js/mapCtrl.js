tweetmapApp.controller('MapCtrl', function ($scope, NgMap) {
	var myMap = this;
	$scope.placeChanged = function() {
		myMap.place = this.getPlace();
		console.log('location','lat:', myMap.place.geometry.location.lat(),'lng:' ,myMap.place.geometry.location.lng());
		myMap.map.setCenter(myMap.place.geometry.location);
	}
	NgMap.getMap().then(function(map) {
		myMap.map = map;
	});
});