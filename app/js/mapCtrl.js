tweetmapApp.controller('MapCtrl', function ($scope, factory, NgMap, MapService) {
	var myMap = this;
	var bounds;
	var center;
	var tweetNameArray = new Array();

	function goToSearchPage(hashtag) {
		MapService.set(hashtag);
	}

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
		tweetNameArray.length=0;
		var tweetArray = factory.getTweetArray();

		//$scope.tweetsWithPos = tweetArray;

		for(var i =0;i<tweetArray.length;i++){

			var randLat = Math.random() * (northEast.lat() - southWest.lat()) + southWest.lat();
			var randLong = Math.random() * (northEast.lng() - southWest.lng()) + southWest.lng();
			var toPush = {pos:[randLat, randLong],text:tweetArray[i]};	
			tweetsWithPos.push(toPush);
		}
		//console.log("tweetpos: " + tweetsWithPos);
		//$scope.tweetsWithPos = tweetsWithPos;
		factory.getSearchTweets().then(function(foundTweets) {
			for (var i = 0; i < foundTweets.statuses.length; i++) {
				console.log("foundTweets: " + foundTweets.statuses.length);
				tweetNameArray.push(foundTweets.statuses[i]);
			}
			$scope.foundTweets = tweetNameArray;
		});
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
