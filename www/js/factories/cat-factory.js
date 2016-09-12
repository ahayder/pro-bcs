angular.module('app.catsFactory', [])

.factory('Categories', ['$localStorage', function($localStorage){

    return{
        getAllCats: function(){
            var allCats = $localStorage.cats;
            return allCats;
        }
    };

}]);
