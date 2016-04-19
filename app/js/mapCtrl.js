tweetmapApp.controller('MapCtrl', function ($scope, factory,NgMap) {
	var myMap = this;
	factory.getTrendsClosest();


	// triggers once the place has changed on search auto complete,
	// sets the current place in the map and in factory
	$scope.placeChanged = function() {
		myMap.place = this.getPlace();
		
		var lat = myMap.place.geometry.location.lat();
		var long = myMap.place.geometry.location.lng();

		factory.setLatLong(lat, long);
		console.log('location','lat:', lat,'lng:' ,long);
		myMap.map.setCenter(myMap.place.geometry.location);
		factory.getTrendsClosest();
		$scope.foundTweets = factory.getTrendsArray();
	}

	NgMap.getMap().then(function(map) {
		myMap.map = map;
	});
});
