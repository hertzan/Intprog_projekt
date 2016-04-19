tweetmapApp.controller('SearchCtrl', function ($scope, factory) {


	$scope.search = function(query) {
		factory.getGeoSearch(query);
		$scope.foundTweets = factory.getTrendsArray();
	}
});
