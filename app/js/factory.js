// Here we create an Angular service that we will use for our 
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
tweetmapApp.factory('factory',function ($resource, $q, $rootScope) {


	var savedData = {}
	// initiate codeBird twitter library
	var cb = new Codebird;
	cb.setConsumerKey("d5Oubu1R7RDMo7XTPHV9mZ2Wd", "0mdfxc87pFUEl6TRLNgdugIckVAUxQBx0rRd585TZ92Vy2ue91");
	cb.setBearerToken("AAAAAAAAAAAAAAAAAAAAADaCuQAAAAAACtY1FqEArZxMhbxMZog97YStjAc%3DB7FK42VBTIZzRGT5HzSX8lBwdCSU4xjjYhBjgtgYbkV88RcD1c");

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


	this.set = function(data) {
		savedData = data;
		console.log("savedData: " + savedData);
 	}

 	this.get = function() {
  		return savedData;
 	}

  // Angular service needs to return an object that has all the
  // methods created in it
  return this;

});
