tweetmapApp.controller('MapCtrl', function ($scope, factory, NgMap) {
	var myMap = this;
	var bounds;
	var zoom;
	var currentCities = new Array();
	var currentPlots = new Array();


	NgMap.getMap().then(function(map) {
		myMap.map = map;
		updateTrends();
		updatePlace();

	});

	// set maximum and minimum zoom levels
	$scope.$on('mapInitialized', function(evt, evtMap) {
	        map = evtMap;
        	map.setOptions({maxZoom:12, minZoom: 4});
	});	

	// triggers once the place has changed on search auto complete,
	// sets the current place in the map and in factory
	$scope.placeChanged = function() {
		myMap.place = this.getPlace();

		myMap.map.setCenter(myMap.place.geometry.location);
	}

	var foundCities = new Array();
	// updates information about the current place
	function updatePlace() {
		if(myMap.map != undefined) {
			// update map information
			zoom = myMap.map.getZoom();
			bounds =  myMap.map.getBounds();
			
			// update the current showing cities
			var citiesInBounds = factory.citiesInBounds(bounds);

			// remove all cities no longer in bounds
			var index = -1;
			for(var i = 0;i<currentCities.length;i++){
				if(citiesInBounds.indexOf(currentCities[i]) == -1){
					removeFromCurrentPlots(currentCities[i]);
				}
			}
			
			// add new cities in bounds
			for(var i = 0;i<citiesInBounds.length;i++){
				if(currentCities.indexOf(citiesInBounds[i]) == -1){
					addToCurrentPlots(citiesInBounds[i]);
				}
			}
			
			// draw all plots on the map
			drawPlots();
			// update the current cities with those in bounds
			currentCities = citiesInBounds;
		}
	}

	// sets the inBounds variable for parameter city to true
	function addToCurrentPlots(city){
		var exists = false;
		for(var j =0;j<currentPlots.length;j++){
			if(city.name == currentPlots[j].city.name){
				currentPlots[j].inBounds = true;
				exists = true;
			}
		}

		if(!exists){
			getPlotCoordinates(city);
		}
	}

	// sets the inBounds variable for parameter city to false
	function removeFromCurrentPlots(city){
		for(var j =0;j<currentPlots.length;j++){
			if(city.name == currentPlots[j].city.name){
				currentPlots[j].inBounds = false;
			}
		}
	}

	// draws all custom markers within variable currentPlots
	function drawPlots(){
		if(currentPlots.length != 0){
			var temp = new Array();
			// go through all plots for all cities
			for(var i =0;i<currentPlots.length;i++){
				// check if it is in bounds
				if(currentPlots[i].inBounds){
					// vary number of results based on current zoom level
					var index = Math.min(zoom-1,currentPlots[i].plots.length);
					for(var j =0;j<index;j++){
						temp.push(currentPlots[i].plots[j]);
					}
				}
			}
			$scope.tweetsWithPos = temp;
		}
	}



	// finds tweets for parameter city and sets the markers on the map
	function getPlotCoordinates(city) {

		var plotCoordinates = new Array();
		var retreivedArray = new Array();
		var plotlat = city.latitude;
		var plotlong = city.longitude;
		var str = "";
		var str2 = "";

		factory.getSearchTweets("#", '"'+plotlat+', '+plotlong+', 20km"',"100", null).then(function(foundTweets) {
			plotCoordinates.length=0;
			retreivedArray = foundTweets.statuses;
			// find the most common tags and mentions
			retreivedArray = getHashtags(retreivedArray);

			// create array with coordinates
			for(var i=0;i<retreivedArray.length;i++) {
				str = retreivedArray[i];
				str2 = str.replace('#', '%23');
				if(retreivedArray[i].length < 15){
					plotCoordinates.push({hash:retreivedArray[i], pos:[plotlat,plotlong], query:str2});
				}
			}
			plotCoordinates = scatterCoordinates(plotCoordinates, [plotlat, plotlong]);
			if(plotCoordinates.length>10){
				plotCoordinates = plotCoordinates.splice(0,10); // only add max 10 per city
			}
			currentPlots.push({city, plots:plotCoordinates, inBounds:true});

			drawPlots();
		});
	}

	// takes in an array of tweets with coordinates and returns a new array with
	// coordinates scattered randomly in a circle around parameter fromCoordinate
	// based on current map zoom level
	function scatterCoordinates(plots, fromCoordinate){
		var radius = zoom/250;
		for(var i =0;i<plots.length;i++){

			// generate random x and y offsets
			x = Math.random() * 2 * radius - radius;
			ylim = Math.sqrt(radius * radius - x * x);
			y = Math.random() * 2 * ylim - ylim;

			plots[i].pos[0] = fromCoordinate[0] +x;
			plots[i].pos[1] = fromCoordinate[1] +y;
		}
		return plots;

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

		// empty all but hashtags
		for(var i = 0; i < tweetString.length; i++){
			if(tweetString[i].startsWith("#") ){
				words.push(tweetString[i]);
			}
		}
		return factory.sortByFrequency(words); // send back results
	}

	// updates the trends list on the side
	function updateTrends(){
		//var words = getHashtags(tweets);
		factory.getTrends().then(function(foundTweets) {

			// show only top 20 results
			$scope.trends=foundTweets[0].trends.slice(0,19);

			// wait for 5 mins and update again
			setTimeout(updateTrends, 300000);		
		});
	}

	// triggers when the map is idle, i.e no movement in either
	// place nor zoom
	$scope.onIdle = function() {
		if(myMap.map != undefined){
			updatePlace(myMap.map);
		}
	}

});
