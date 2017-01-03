(function(){
  'use strict';

    angular.module('app.leaderboardController', [])

    .controller('leaderboardCtrl', leaderboardCtrl);
    
    leaderboardCtrl.$inject = ['$scope', '$rootScope', '$firebaseArray', 'ionicToast', '$ionicLoading', '$firebaseObject'];

    function leaderboardCtrl($scope, $rootScope, $firebaseArray, ionicToast, $ionicLoading, $firebaseObject) {

        var vm = this;

        // Fucntion for getting the array postion
        function arrayObjectIndexOf(myArray, searchTerm, property) {
            for(var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm) return i;
            }
            return -1;
        }// Fucntion for getting the array postion


        $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner>'
        });

        // Checking network connection
        if(window.Connection) {
            if(navigator.connection.type == Connection.NONE) {
                firebase.database().goOffline();
                ionicToast.show("দুঃখিত আপনার ইন্টারনেট সংযোগ বিচ্ছিন্ন রয়েছে। ইন্টারনেট একটিভেট করে কুইজ দিয়ে লিডারবোর্ডে যোগ দিন। সারা বাংলাদেশের মধ্যে আপনার অবস্থান দেখুন।", 'middle', false, 5000);
            }
            else{
                firebase.database().goOnline();
                var leadersRef = firebase.database().ref().child("leaderboard");
                var allleaders = $firebaseArray(leadersRef);

                // Var for logged in enrolled user information
                vm.your = {};
                
                allleaders.$loaded().then(function(result){
                    vm.allleaders = result;
                    vm.totalLeaders = result.length;
                    console.log(vm.allleaders);
                    $ionicLoading.hide();

                    if($rootScope.user == null){ // if user is not logged in
                        vm.loginState = false;
                        //console.log("true");
                    }else{ // if logged in
                        vm.loginState = true;
                        var leaderRef = firebase.database().ref().child("leaderboard/"+$rootScope.user.uid);
                        // console.log(leaderRef);
                        var leader = $firebaseObject(leaderRef);
                        
                        leader.$loaded().then(function(data){
                            console.log(data);

                            if(data.$value !== null){ // if user is enrolled in leader board
                                console.log("true");
                                vm.enrolled = true;
                                vm.notEnrolled = false;

                                // Getting user position
                                var allLeaders = result;
                                allLeaders.sort(function(a, b){
                                    var aScore = parseInt(a.score);
                                    var bScore = parseInt(b.score);
                                    return bScore - aScore;
                                });

                                var position = arrayObjectIndexOf(allLeaders, $rootScope.user.uid, "$id"); // 1
                                vm.your.position = position+1;
                                vm.your.score = allLeaders[position].score;
                                vm.your.correctness = allLeaders[position].correctness;
                                // End of getting postion
                                
                                
                            }else{ // if user is not enrolled in leader baord
                                console.log("false");
                                vm.enrolled = false;
                                vm.notEnrolled = true;

                            } // End of if user is not enrolled in leader baord
                        },function(error){
                            ionicToast.show('দুঃখিত আবার চেষ্টা করুন।', 'middle', false, 2000);
                        });
                    } // end of if logged in
                },function(error){
                    ionicToast.show('দুঃখিত আবার চেষ্টা করুন।', 'middle', false, 2000);
                    $ionicLoading.hide();
                });
            }
        }
                    

        


    }

})();