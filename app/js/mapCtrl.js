tweetmapApp.controller('MapCtrl', function ($scope, factory,NgMap) {
	var myMap = this;
	var bounds;
	var center;	
	var lat = 59.3293235;
	var long = 18.0685808;
	var tweetNameArray = new Array();

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

			lat = center.lat();
			long = center.lng();
		}
	}

	// updates the trends list on the side
	function updateTrends(tweets){
		tweetNameArray.length=0;

		for (var i = 0; i < tweets.statuses.length; i++) {
			tweetNameArray.push(tweets.statuses[i]);
		}
		$scope.foundTweets = tweetNameArray;
		
	}

	// updates the map with tweets to show as custom markers
	function updateMap(tweets){
		var tweetString = "";
		// remove all non-geotagged tweets and add the rest to a string
		for(var i = 0;i<tweets.length;i++){
			if(tweets[i].coordinates == null){
				tweets.splice(i,1);
				i--;
			} else {
				tweetString += tweets[i].text;
			}
		}

		tweetString = tweetString.toLowerCase();
		tweetString = tweetString.split(" ");
		var words = new Array();

		// empty all but hashtags and @
		for(var i = 0; i < tweetString.length; i++){
			if(tweetString[i].substring(0,1) == "@" || tweetString[i].substring(0,1) == "#"){
				words.push(tweetString[i]);
			}
		}
		
		words = factory.sortByFrequency(words);

		// create the new array with positions for markers on the map
		var wordsWithPos = new Array();
		for(var i = 0; i<words.length;i++){
			var avgLat = 0
			var avgLong = 0;
			var numberOfMatches = 0;
			// search for each keyword in all found tweets
			for(var j = 0;j<tweets.length;j++){
				var tweetText = tweets[j].text;
				if(tweetText.indexOf(words[i]) != -1){
					// found a match! increase matches and average coordinates
					numberOfMatches++;
					avgLat += tweets[j].coordinates.coordinates[1];
					avgLong += tweets[j].coordinates.coordinates[0];
				}
			}
			
			avgLat = avgLat / numberOfMatches;
			avgLong = avgLong / numberOfMatches;

			var toPush = {pos:[avgLat,avgLong],word:words[i]};
			wordsWithPos.push(toPush);
		}
		$scope.tweetsWithPos = wordsWithPos;
	}

	// triggers when the map is idle, i.e no movement in either
	// place nor zoom
	$scope.onIdle = function() {
		updatePlace();

		factory.getSearchTweets("#", '"'+lat+', '+long+', 10km"',"15").then(function(foundTweets) {
			updateTrends(foundTweets);
			updateMap(foundTweets.statuses);
		});
	}

	NgMap.getMap().then(function(map) {
		myMap.map = map;
	});
});
