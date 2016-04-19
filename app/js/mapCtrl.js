tweetmapApp.controller('MapCtrl', function ($scope, factory,NgMap) {
	var myMap = this;
	factory.getTrendsClosest();
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

	// updates the trends list
	function updateTrends(){
		factory.getSearchTweets();

		console.log("updating trends!");

		// TODO find a way to wait for ajax end before here
		var tweetArray = factory.getTweetArray();
		var tweetsWithPos = new Array();
		if(bounds != undefined){
		var northEast = bounds.getNorthEast();
		var southWest = bounds.getSouthWest();
		}


		for(var i =0;i<tweetArray.length;i++){

			var randLat = Math.random() * (northEast.lat() - southWest.lat()) + southWest.lat();
			var randLong = Math.random() * (northEast.lng() - southWest.lng()) + southWest.lng();
			var toPush = {pos:[randLat, randLong],text:tweetArray[i]};	
			tweetsWithPos.push(toPush);
		}
		console.log(tweetsWithPos);
		$scope.tweetsWithPos = tweetsWithPos;
		$scope.$apply();

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
