tweetmapApp.factory('MapService', function($resource, $q, $rootScope) {

	var savedData = {}

	function set(data) {
		savedData = data;
 	}

 	function get() {
  		return savedData;
 	}

 	return {
  		set: set,
  		get: get
 	}
});