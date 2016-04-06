// Search controller that we use whenever we have a search inputs
// and search results
dinnerPlannerApp.controller('SearchCtrl', function ($scope,Dinner) {

  // TODO in Lab 5: you will need to implement a method that searchers for dishes
  // including the case while the search is still running.
  $scope.status = "Loading...";
  $scope.isLoading=1;


   $scope.search = function(query) {
   $scope.status = "Searching...";
   $scope.isLoading=1;
   Dinner.DishSearch.get({title_kw:query}, function(data){
   	 $scope.isLoading=0;
     $scope.dishes = data.Results;
     $scope.status = "Showing " + data.Results.length + " results";
   },function(){
     $scope.status = "There was an error";
   });
 }
 	//populates site for first run
    Dinner.DishSearch.get({},function(data){
	 $scope.dishes = data.Results;
     $scope.status = "Showing " + data.Results.length + " results";
     $scope.isLoading=0;
	},function(){
     $scope.status = "There was an error";
   });

});