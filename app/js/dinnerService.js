// Here we create an Angular service that we will use for our 
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
tweetmap.factory('tweetmap',function ($resource,$cookieStore) {
  
  var numberOfGuests = 4;
  var maxdishes = 0;
  var addedDishes = [];
  var thisPrice = 0;

  var getTotalPrice = 0;
  
  var map;



  // ---------------------------------Lab 4 starts here!-------------------------------------

  // API key for BigOven data.
  //var apiKey = "sV1fPGQKrO0b6oUYb6w9kLI8BORLiWox";
  //this.DishSearch = $resource('http://api.bigoven.com/recipes',{pg:1,rpp:25,api_key:apiKey});
  //this.Dish = $resource('http://api.bigoven.com/recipe/:id',{api_key:apiKey}); 

  var getDish = this.Dish.get;
  var getDishPrice = this.getDishPrice;


    if($cookieStore.get('numberOfGuests')) {
      numberOfGuests = $cookieStore.get('numberOfGuests');
    }


    if($cookieStore.get('addedDishes')) {
      addedDishes = $cookieStore.get('addedDishes');
      for (var i = 0; i < addedDishes.length; i++) {
        getDish({id:addedDishes[i]}, function(dish) {
          dish.Price = getDishPrice(dish);
          menu.push(dish);
          }, function(data) {
            console.log("there was an error")
          });
      }
    }


 
  // Angular service needs to return an object that has all the
  // methods created in it. You can consider that this is instead
  // of calling var model = new DinnerModel() we did in the previous labs
  // This is because Angular takes care of creating it when needed.
  return this;

});