// Here we create an Angular service that we will use for our 
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
module.factory('factory',function ($resource) {

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
	

	// gets trending tweets from a place, based on its yahoo Where On Earth ID
	function getTrendsPlace (woeid) {
		cb.__call(
			"trends_place",
			"id="+woeid,
			function (reply) {
		        	if (reply === undefined) {
					console.log("error : ");
					console.log(reply);
		        	} else {
					console.log("Trending hashtags: ");
					console.log(reply[0].trends);
				}
			},
			true // needed for app-only authentication call
		);
	}

	// gets the closest location twitter has trending data for, based on
	// latitude and longitude. also passes on to getTrendsPlace, should be separated
	function getTrendingClosest(lat, long){

		var params = {lat: lat, long:long};
		var woeid;
		cb.__call(
			"trends_closest",
			params,
			function (reply) {
		        	if (reply[0].woeid === undefined) {
					console.log("error : ");
					console.log(reply);
		        	} else {
					console.log("success! woeid: "+reply[0].woeid);
					woeid = reply[0].woeid;
					getTrendsPlace(woeid);
				}
			},
			true // needed for app-only authentication call
		);
	
	}

	// searches the world for latitude and longitude coordinates.
	// also passes on to getTrendingClosest, should be separated later
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
