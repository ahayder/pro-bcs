angular.module('app.subFactory', [])

.factory('SubCategories', ['$localStorage', function($localStorage){
    return{
        getAllSubCats: function(){
            var allSubs = [];
            return $localStorage.subCats;
        }
    };
}]);
