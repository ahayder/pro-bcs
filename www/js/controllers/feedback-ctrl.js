(function(){
  'use strict';

    angular.module('app.feedbackController', [])
        
    .controller('feedbackCtrl', feedbackCtrl);
    
    feedbackCtrl.$inject = ['$scope', '$state', '$firebaseArray', 'ionicToast'];

    function feedbackCtrl($scope, $state, $firebaseArray, ionicToast) {

        var vm = this;

        vm.feed = {};
        vm.feed.text = "";

        vm.save = function(text){
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
                    vm.feed.text = "";
                }
            }// Checking network connection
        }
        
    }

})();