tweetmapApp.controller('MapCtrl', function ($scope, factory, NgMap) {
	var myMap = this;
	var bounds;
	var center;	
	var lat = 59.3293235;
	var long = 18.0685808;
	var tweetNameArray = new Array();

	$scope.goToSearchPage = function(hashtag) {
		factory.setHashtag(hashtag.word);
		factory.setPosition(hashtag.pos);
		console.log("pos: " + hashtag.pos)
	}

	// triggers once the place has changed on search auto complete,
	// sets the current place in the map and in factory
	$scope.placeChanged = function() {
		
		myMap.place = this.getPlace();

		myMap.map.setCenter(myMap.place.geometry.location);
	}

	// updates information about the current place
	function updatePlace() {
		if(myMap.map != undefined) {
			bounds =  myMap.map.getBounds();
			center = myMap.map.getCenter();

			factory.setBounds(bounds);
			lat = center.lat();
			long = center.lng();

		}
	}

	$scope.placeTweetOnMap = function() {

	}

	function plotStuff(city) {
		lat = city.latitude;
		long = city.longitude;
		var plotArray = new Array();

		recursiveGetCalls(5, plotArray, null);
		$scope.tweetsWithPos = getHashtags(plotArray);

	}



	// returns an array of the 20 most common hashtags from an array of full tweet texts.
	function getHashtags(tweets){
		var tweetString = "";
	
		// Add all tweets to a string
		for(var i = 0;i<tweets.length;i++){
			tweetString += tweets[i].text;
		}

		tweetString = tweetString.toLowerCase();
		tweetString = tweetString.split(" ");
		var words = new Array();

		// empty all but hashtags and @
		for(var i = 0; i < tweetString.length; i++){
			if(tweetString[i].substring(0,1) == "#"){
				words.push(tweetString[i]);
			}
		}
		return factory.sortByFrequency(words).slice(0,19); // send back top 20 results
	}

	// updates the trends list on the side
	function updateTrends(tweets){
		var words = getHashtags(tweets);
		console.log(words);
		$scope.tweets = words;		
	}

	// updates the map with tweets to show as custom markers
	function updateMap(tweets){
		var words = getHashtags(tweets);

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

			// find average coordinates and push to show
			avgLat = avgLat / numberOfMatches;
			avgLong = avgLong / numberOfMatches;

			var toPush = {pos:[avgLat,avgLong],word:words[i]};
			wordsWithPos.push(toPush);
		}

		// show on the map
		$scope.tweetsWithPos = wordsWithPos;
	}

	// triggers when the map is idle, i.e no movement in either
	// place nor zoom
	$scope.onIdle = function() {

		updatePlace();

		console.log(factory.citiesInBounds());
		var recursiveArray = new Array();
		recursiveGetCalls(0, recursiveArray, null);

	}

	// recursive function for making 10 independent get Search/Tweet calls, appending
	// the total array of results.
	function recursiveGetCalls(index, array, max_id){
		if(index < 10){
			// make the API call and update trends list and map markers
			factory.getSearchTweets("#", '"'+lat+', '+long+', 10km"',"100", max_id).then(function(foundTweets) {
				array = array.concat(foundTweets.statuses);

				// search for a new max id
				max_id = findMinID(foundTweets.statuses);

				console.log("finished call no: " + index);

				// do next call with updated index, array, and max_id
				recursiveGetCalls(index+1, array, max_id);
			});
			if(index == 10) {
				return array;
			}
		}
	}

	// function for finding the minimum ID (the oldest tweet) in an array of tweets
	function findMinID(tweets){
		var min_id = tweets[0].id;
		for(var i=0;i<tweets.length;i++){
			min_id = Math.min(min_id, tweets[i].id);
		}
		return min_id;
	}

	NgMap.getMap().then(function(map) {
		myMap.map = map;
	});
});
