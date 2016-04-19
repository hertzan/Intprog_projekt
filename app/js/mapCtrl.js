tweetmapApp.controller('MapCtrl', function ($scope, factory,NgMap) {
	var myMap = this;
	console.log(myMap);
	factory.getTrendsClosest();
	var bounds;


	// triggers once the place has changed on search auto complete,
	// sets the current place in the map and in factory
	$scope.placeChanged = function() {
		myMap.place = this.getPlace();
		//updatePlace();

		myMap.map.setCenter(myMap.place.geometry.location);
		//updateTrends();		
	}

	// updates information about the current place
	function updatePlace(){
		
		if(myMap.map != undefined) {
			bounds =  myMap.map.getBounds();
			center = myMap.map.getCenter();

			var lat = center.lat();
			var long = center.lng();
			factory.setLatLong(lat, long);
		}
	}

	// updates the trends list
	function updateTrends(){
		factory.getTrendsClosest(); // replace this with correct api call

		$scope.foundTweets = factory.getTrendsArray();
	}

	// triggers when the map is idle, i.e no movement in either
	// place nor zoom
	$scope.onIdle = function() {
		updatePlace();
		updateTrends();
	}

	NgMap.getMap().then(function(map) {
		myMap.map = map;
	});
});
