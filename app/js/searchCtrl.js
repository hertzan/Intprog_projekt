/*global $ */
tweetmapApp.controller('SearchCtrl', function ($scope, factory) {
	
	$scope.status = "Loading tweets...";
	$scope.isLoading = 1;
	var list = new Array();

	var query = factory.get();
	console.log(query);

	factory.getSearchTweets(query, null, 20).then(function(foundTweets) {
		for (var i = 0; i < foundTweets.statuses.length; i++) {
			list.push(foundTweets.statuses[i]);
		}
		$scope.status = "Found Tweets!";
		$scope.isLoading = 0;
		$scope.list = list;
	});

	$(window).scroll(function () {
   	if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
    	factory.getSearchTweets(query, null, 20).then(function(foundTweets) {
		for (var i = 0; i < foundTweets.statuses.length; i++) {
			list.push(foundTweets.statuses[i]);
		}
	});
   }
});
});
