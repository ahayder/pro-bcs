angular.module('app.updateFactory', [])

.factory('UpdateFactory', ['$firebaseArray', '$localStorage',
function($firebaseArray, $localStorage){

    return{
        getCatsFromFirebase: function(){
            // categories
            var catRef = firebase.database().ref().child("categories");
            var categories = $firebaseArray(catRef);

            return categories.$loaded();
        },
        getSubCatsFromFirebase: function(){
            // categories
            var subRef = firebase.database().ref().child("subCategories");
            var allSubs = $firebaseArray(subRef);

            return allSubs.$loaded();
        },
        getQuestionsFromFirebase: function(){
            // categories
            var quesRef = firebase.database().ref().child("questions");
            var allQuestions = $firebaseArray(quesRef);

            return allQuestions.$loaded();
        },
        updateCats: function(c){
            $localStorage.cats = c;
            return true;
        },
        updateSubCats: function(s){
            $localStorage.subCats = s;
            return true;
        },
        updateQuestions: function(q){
            $localStorage.questions = q;;
            return true;
        }
    };

}]);