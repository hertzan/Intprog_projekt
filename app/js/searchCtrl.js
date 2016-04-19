tweetmapApp.controller('SearchCtrl', function ($scope, factory) {


	function updateTrends(){
		factory.getTweetsFromTrends();
		setTimeout(function(){
    		//do what you need here
		}, 2000);
		$scope.searchTweets = factory.getTweetsFromTrendsArray();
		console.log(factory.getTweetsFromTrendsArray());
	}
	
	
	updateTrends();
});
