tweetmapApp.controller('SearchCtrl', function ($scope, factory) {
	
	$scope.status = "Loading tweets...";
	$scope.isLoading = 1;
	console.log("hejhe");
	var list = new Array();
	factory.getTweetsFromTrends("NYC");
	
	function updateTrends(){
		factory.getTweetsFromTrends("NYC");
		
		list = factory.getTweetsFromTrendsArray();
		console.log("tweetArray: " + list);
		$scope.isLoading = 0;
	}
	
	
	updateTrends();
});
