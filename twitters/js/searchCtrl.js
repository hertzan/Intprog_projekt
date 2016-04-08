module.controller('SearchCtrl', function ($scope, factory) {


	$scope.search = function(query) {
		factory.getGeoSearch(query);
	}
});
