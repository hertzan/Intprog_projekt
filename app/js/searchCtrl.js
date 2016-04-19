tweetmapApp.controller('SearchCtrl', function ($scope, factory) {


	$scope.search = function(query) {
		factory.getGeoSearch();
		$scope.foundTweets = factory.getTrendsArray();
	}
});
