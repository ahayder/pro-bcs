angular.module('app.quesFactory', [])

.factory('Questions', ['$localStorage', function($localStorage){
    return{
        getAllQuestions: function(){
            return $localStorage.questions;
        }
    };
}]);
