// Here we create an Angular service that we will use for our 
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
tweetmapApp.factory('factory',function ($resource, $q, $rootScope) {

	// variable used for saving JSON object of all cities and their locations
	var cities;
	readCities();

	var bounds;

	var savedHash = {}
	var savedPos = {}
	// initiate codeBird twitter library
	var cb = new Codebird;
	cb.setConsumerKey("d5Oubu1R7RDMo7XTPHV9mZ2Wd", "0mdfxc87pFUEl6TRLNgdugIckVAUxQBx0rRd585TZ92Vy2ue91");
	cb.setBearerToken("AAAAAAAAAAAAAAAAAAAAADaCuQAAAAAACtY1FqEArZxMhbxMZog97YStjAc%3DB7FK42VBTIZzRGT5HzSX8lBwdCSU4xjjYhBjgtgYbkV88RcD1c");

	// read the json file for cities names and locations
	function readCities(){
		$.ajax({
			url: "\cities.json",
			success: function (data) {
			        cities = data;

    			}
		});
	}

	this.setBounds = function(mapBounds){
		bounds = mapBounds;

	}

	// returns an array of all cities currently within the map bounds.
	// returns an empty array if no cities are within the bounds.
	this.citiesInBounds = function(){
		if(bounds == undefined) { return new Array(); }
		var latLng;
		var citiesArray = new Array();
		for(var i=0;i<cities.length;i++){
			latLng = new google.maps.LatLng(cities[i].latitude, cities[i].longitude); 
			if(bounds.contains(latLng)){
				citiesArray.push(cities[i]);
			}
		}
		return citiesArray;
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

	// sort an array by frequency of occurences
	this.sortByFrequency = function(array) {
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

	// searches for tweets.
	// @params: query = query to search for, geocode = lat, long and radius for search
	// count = number of items to show per page
	this.getSearchTweets = function (query, geocode, count, max_id) {
		var deffered = $q.defer();
		if(geocode == null){
			var params = {q:query, count:count};
		} else if (max_id == null){
			var params = {q:query, geocode:geocode,count:count};
		} else {
			var params = {q:query, geocode:geocode,count:count, max_id:max_id};
		}
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


	this.setHashtag = function(data) {
		savedHash = data;
		console.log("savedHash: " + savedHash);
 	}
 	this.setPosition = function(data) {
		savedPos = data;
		console.log("savedPos: " + savedPos);
 	}

 	this.getHashtag = function() {
  		return savedHash;
 	}

 	this.getPosition = function() {
  		return savedPos;
 	}

  // Angular service needs to return an object that has all the
  // methods created in it
  return this;

});
