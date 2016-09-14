angular.module('app.feedbackController', [])
     
.controller('feedbackCtrl', ['$scope', '$rootScope', '$state', '$ionicLoading', 'Questions', '$stateParams', '$firebaseArray', 'ionicToast', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $rootScope, $state, $ionicLoading, Questions, $stateParams, $firebaseArray, ionicToast) {

    $scope.feed = {};
    $scope.feed.text = "";

    $scope.save = function(text){
        // Checking network connection
        if(window.Connection) {
            if(navigator.connection.type == Connection.NONE) {
                firebase.database().goOffline();
                ionicToast.show("এটি একটি অনলাইন ফিচার। ইন্টারনেট একটিভেট করে চেষ্টা করুন।", 'top', false, 3000);
            }
            else{
                firebase.database().goOnline();
                var feedbackRef = firebase.database().ref().child("feedback");
                var feedbacks = $firebaseArray(feedbackRef);

                feedbacks.$add(text).then(function(response){
                    ionicToast.show('ধন্যবাদ আপনার সহযোগিতার জন্য।', 'top', false, 2000);
                },function(error){
                    ionicToast.show('দুঃখিত আবার চেষ্টা করুন', 'middle', false, 1000);
                });
                $scope.feed.text = "";
            }
        }// Checking network connection
    }
    
    



}]);