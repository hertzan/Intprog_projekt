// Here we create an Angular service that we will use for our 
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
tweetmapApp.factory('factory',function ($resource, $q, $rootScope) {

	// initiate codeBird twitter library
	var cb = new Codebird;
	cb.setConsumerKey("d5Oubu1R7RDMo7XTPHV9mZ2Wd", "0mdfxc87pFUEl6TRLNgdugIckVAUxQBx0rRd585TZ92Vy2ue91");
	cb.setBearerToken("AAAAAAAAAAAAAAAAAAAAADaCuQAAAAAACtY1FqEArZxMhbxMZog97YStjAc%3DB7FK42VBTIZzRGT5HzSX8lBwdCSU4xjjYhBjgtgYbkV88RcD1c");


	// set Stockholm as first place on the map
	var latitude = 59.3293235;
	var longitude = 18.0685808;

	var tweetArray = new Array();


	var trendsArray = new Array();
	var tweetsFromTrends = new Array();

	this.getTweetsFromTrendsArray = function() {
		return tweetsFromTrends;
	}

	this.getTrendsArray = function() {
		return trendsArray;
	}

	this.getTweetArray = function(){
		return tweetArray;
	}



	// get the authenticating bearer token, not needed at the moment
	this.getBearerToken = function () {
		cb.__call("oauth2_token", {},function (reply, err) {

	        	if (err) {
	        		console.log("error response or timeout exceeded" + err.error);
	        	}
	        	if (reply) {
				console.log(reply.access_token);
				cb.setBearerToken(reply.acces_token);
	        	}
		});	
	}

	// sets the current latitude and longitude coordinates
	this.setLatLong = function(lat, long){
		latitude = lat;
		longitude = long;
	}

	// sort an array by frequency of occurences
	function sortByFrequency(array) {
		var frequency = {}, value;
		
		// count the frequency of each word
		for(var i = 0; i < array.length; i++){
			value = array[i];
    			if(value in frequency) {
            			frequency[value]++;
        		} else {
           			frequency[value] = 1;
        		}
		}

		// create uniques array to sort later
		var uniques = [];
    		for(value in frequency) {
    			uniques.push(value);
   		 }

		// sort by frequency
		uniques = uniques.sort(function(a, b) {
	        	return frequency[b] - frequency[a];
	    	});
		return uniques;
	}


	// finds the most common words used in the tweet results
	function commonTweetWords(tweets){
		// empty of all current tweets in the array
		tweetArray.length = 0;
		
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
		
		words = sortByFrequency(words);
		console.log(words);

		var wordsWithPos = new Array();
		for(var i = 0; i<words.length;i++){
			var avgLat = 0
			var avgLong = 0;
			var numberOfMatches = 0;

			for(var j = 0;j<tweets.length;j++){
				var tweetText = tweets[j].text;
				if(tweetText.indexOf(words[i]) != -1){
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
	}

	this.getSearchTweets = function () {
<<<<<<< HEAD
		var deffered = $q.defer();
		var params = {q:"#", geocode:'"'+latitude+', '+longitude+', 10km"'};
=======
		var params = {q:"#", geocode:'"'+latitude+', '+longitude+', 10km"',count:"100"};
>>>>>>> 27f12bdfd18c6e6286e725d655cd620d4e0f5583
		cb.__call(
			"search_tweets",
			params,
			function (reply) {
		        	if (reply === undefined) {
					console.log("error : ");
					console.log(reply);
<<<<<<< HEAD
		        	}
		        	deffered.resolve(reply);
=======
		        	} else {
					commonTweetWords(reply.statuses);
				}
>>>>>>> 27f12bdfd18c6e6286e725d655cd620d4e0f5583
			},
			true // needed for app-only authentication call
		);
		return deffered.promise;
	}




// ==================================================================================================================================

	// gets trending tweets from a place, based on its yahoo Where On Earth ID.
	// saves the trends in an array for later access in map and potential list
	function getTrendsPlace (woeid) {
		cb.__call(
			"trends_place",
			"id="+woeid,
			function (reply) {
		        	if (reply === undefined) {
					console.log("error : ");
					console.log(reply);
		        	} else {
					// empty the existing trendsArray
					trendsArray.length = 0;					

					// save the new trending tweets in trendsArray					
					for(var i=0; i< reply[0].trends.length;i++){
						trendsArray.push(reply[0].trends[i]);
					}

					//console.log("trendslist " + trendsArray);

				}
			},
			true // needed for app-only authentication call
		);
	}

	// gets the closest WOEID location twitter has trending data for, based on current
	// latitude and longitude. also passes on to getTrendsPlace, should maybe be separated
	this.getTrendsClosest = function(){

		var params = {lat: latitude, long: longitude};
		var woeid;
		cb.__call(
			"trends_closest",
			params,
			function (reply) {
		        	if (reply[0] === undefined) {
					console.log("error : ");
					console.log(reply);
		        	}
		        	woeid = reply[0].woeid;
		        	success: getTrendsPlace(woeid);
			},
			true // needed for app-only authentication call
		);
	
	}

	this.getTweetsFromTrends = function(query) {
		var deffered = $q.defer();
		var params = {
    		q: query,
    		count:20
		};
		cb.__call(
			"search_tweets",
			params,
			function (reply) {
		        	if (reply === undefined) {
					console.log("error : ");
					console.log(reply);
		        	}
		        	deffered.resolve(reply);
			},
			true // needed for app-only authentication call
		);
		return deffered.promise;
	
	}

	// searches the world for latitude and longitude coordinates.
	// also passes on to getTrendingClosest, should be separated later
	// NOT USED AT THE MOMENT, REQUIRES USER AUTHENTICATION
	this.getGeoSearch = function (query) {
		var longitude = 0;
		var latitude = 0;
		// get the latitude and longitude
		cb.__call(
   			"geo_search",
			"query=" + query,
			function (reply) {
				if(reply.httpstatus == 200){
					
					if(reply.result === undefined) {
						console.log("error message: "+reply.errors[0].message);
					} else {
						console.log("found place: ");
						console.log(reply.result.places[0]);
						var coordinates = reply.result.places[0].bounding_box.coordinates[0];
	
						// find the center of the bounding box, perhaps use centroid instead
						for (i = 0; i < coordinates.length; i++) { 
							longitude += coordinates[i][0];
							latitude += coordinates[i][1];
						}
						longitude = longitude/coordinates.length;
						latitude = latitude/coordinates.length;
	
						getTrendingClosest(latitude, longitude);
					}
				}
    			},
			true // this parameter required
		);
	}
		


	




  // Angular service needs to return an object that has all the
  // methods created in it
  return this;

});
