angular.module('app.initFactory', [])

.factory('InitFactory', ['$localStorage', '$http',
function($localStorage, $http){

    return{
        initCats: function(){

            // if app is running first time
            if(!$localStorage.hasOwnProperty("cats")){
                $http.get("jsons/cats.json").then(function(response){
                    $localStorage.cats = response.data;
                    return true;
                },function(error){
                    console.log(error);
                });
            }else{
                return true;
            }
            
        },
        initSubCats: function(){

            // if app is running first time
            if(!$localStorage.hasOwnProperty("subCats")){
                $http.get("jsons/sub-cats.json").then(function(response){
                    $localStorage.subCats = response.data;
                    return true;
                },function(error){
                    console.log(error);
                });
            }else{
                return true;
            }
            
        },
        initQuestions: function(){

            // if app is running first time
            if(!$localStorage.hasOwnProperty("questions")){
                $http.get("jsons/questions.json").then(function(response){
                    $localStorage.questions = response.data;
                    return true;
                },function(error){
                    console.log(error);
                });
            }else{
                return true;
            }
            
        },
    };

}]);