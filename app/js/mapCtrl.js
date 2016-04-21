tweetmapApp.controller('MapCtrl', function ($scope, factory,NgMap) {
	var myMap = this;
	var bounds;
	var center;

	// triggers once the place has changed on search auto complete,
	// sets the current place in the map and in factory
	$scope.placeChanged = function() {
		myMap.place = this.getPlace();

		myMap.map.setCenter(myMap.place.geometry.location);
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

	// updates the trends list and sets custom markers on the map
	function updateTrends(){
		factory.getSearchTweets();

		var tweetArray = factory.getTweetArray();

		$scope.tweetsWithPos = tweetArray;


		$scope.foundTweets = factory.getTrendsArray();
		// apply the changes
		$scope.$apply();
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
