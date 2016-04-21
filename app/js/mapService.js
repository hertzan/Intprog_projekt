tweetmapApp.factory('MapService', function($resource, $q, $rootScope) {

	var savedData = {}

	this.set = function(data) {
		savedData = data;
 	}

 	this.get = function() {
  		return savedData;
 	}
 	return this;
});