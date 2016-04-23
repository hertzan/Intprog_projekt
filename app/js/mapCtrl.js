tweetmapApp.controller('MapCtrl', function ($scope, factory, NgMap) {
	var myMap = this;
	var bounds;
	var center;	
	var lat = 59.3293235;
	var long = 18.0685808;
	var currentCities = new Array();

	updateTrends();

	

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

			// update the current showing cities
			var citiesInBounds = factory.citiesInBounds(bounds);
			for(var i = 0;i<citiesInBounds.length;i++){
				// only plot markers for those not currently in bounds
				if(currentCities.indexOf(citiesInBounds[i]) == -1){
					// TODO plotta för stad som ej syns
					//plotStuff(citiesInBounds[i]);
					console.log("currentCities before: ");
					console.log(citiesInBounds[i]);
					console.log("plotting for: " + citiesInBounds[i].name);
					$scope.tweetsWithPos = getPlotCoordinates(citiesInBounds[i]);
				}
			}
			// update the current cities with those in bounds
			currentCities = citiesInBounds;

			lat = center.lat();
			long = center.lng();

		}
	}

	var plotArray = new Array();

	function plotStuff(city) {
		console.log("City: ");
		console.log(city);
		lat = city.latitude;
		long = city.longitude;

		//för snabba för tillfället...
		plotHelp(plotArray);
		plotArray = getHashtags(plotArray);

		//myMap.map.customMarkers.foo.setPosition(lat, long);
	}

	function getPlotCoordinates(city) {
		var plotCoordinates = new Array();
		var retreivedArray = new Array();
		var plotlat = city.latitude;
		var plotlong = city.longitude;

		retreivedArray = recursiveGetCalls(5, plotlat, plotlong, plotCoordinates, null);

		for(var i=0;i<retreivedArray.length;i++) {
			plotCoordinates.push([name[retreivedArray[i]], pos[plotlat,plotlong]]);
			//ingen aning vad detta kommer plotta men man måste testa något hehe...
			if(i % 2 == 0){
				plotlat + 1;
				plotlong - 0.5;
			} else {
				plotlong + 1;
				plotlat - 0.5;
			}
		}
		return plotCoordinates;
	}


	// returns an array of the 20 most common hashtags from an array of full tweet texts.
	function getHashtags(tweets){
		var tweetString = "";
	
		// Add all tweets to a string
		for(var i = 0;i<tweets.length;i++){
			tweetString += tweets[i].text;
		}

		tweetString = tweetString.toLowerCase();
		tweetString = tweetString.replace(/[^\w\s]/, "");
		tweetString = tweetString.split(" ");

		var words = new Array();

		// empty all but hashtags and @
		for(var i = 0; i < tweetString.length; i++){
			if(tweetString[i].length > 2 && !tweetString[i].endsWith(":") && (tweetString[i].startsWith("#") ||tweetString[i].startsWith("@"))){
				words.push(tweetString[i]);
			}
		}
		return factory.sortByFrequency(words).slice(0,19); // send back top 20 results
	}

	// updates the trends list on the side
	function updateTrends(){
		//var words = getHashtags(tweets);
		factory.getTrends().then(function(foundTweets) {
			console.log("updating trends:");
			console.log(foundTweets);
			trendsArr = foundTweets.trends;

			$scope.trends=foundTweets[0].trends.slice(0,19);

			// wait for 5 mins and update again
			setTimeout(updateTrends, 300000);		
		});
		//$scope.tweets = words;		
	}

	// triggers when the map is idle, i.e no movement in either
	// place nor zoom
	$scope.onIdle = function() {

		updatePlace();

		//var recursiveArray = new Array();
		//recursiveGetCalls(0, recursiveArray, null);
	}

	// recursive function for making 10 independent get Search/Tweet calls, appending
	// the total array of results.
	function recursiveGetCalls(index, latitude, longitude, array, max_id){
		if(index < 10){
			// make the API call and update trends list and map markers
			factory.getSearchTweets("#", '"'+latitude+', '+longitude+', 10km"',"100", max_id).then(function(foundTweets) {
				array = array.concat(foundTweets.statuses);

				// search for a new max id
				max_id = findMinID(foundTweets.statuses);

				console.log("finished call no: " + index);

				// do next call with updated index, array, and max_id
				recursiveGetCalls(index+1, latitude, longitude, array, max_id);
			});
		}
		if(index == 10) {
				return array;
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
