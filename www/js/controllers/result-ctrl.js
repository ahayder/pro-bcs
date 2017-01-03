(function(){
  'use strict';

angular.module('app.resultController', [])

.controller('resultCtrl', resultCtrl)

resultCtrl.$inject = ['$scope', '$state', '$rootScope', 'ResultFacotry', '$stateParams', '$ionicModal', 'Auth', 'ionicToast', '$firebaseArray', '$firebaseObject', 'ngFB', '$ionicHistory'];

function resultCtrl($scope, $state, $rootScope, ResultFacotry, $stateParams, $ionicModal, Auth, ionicToast, $firebaseArray, $firebaseObject, ngFB, $ionicHistory) {

    var vm = this;

    // Admob code
        // preppare and load ad resource in background, e.g. at begining of game level
        var inter_key = "ca-app-pub-9736917302037050/4559941520";
        try{
            if(AdMob) AdMob.prepareInterstitial( {adId: inter_key, autoShow:true, isTesting:false} );
            // show the interstitial later, e.g. at end of game level
            if(AdMob) AdMob.showInterstitial();
        }catch(e){
            conosole.log(e);
        }
        
    // End of Admob code

    
    // Finding next set
    vm.subcategoryId = $stateParams.subId;
    vm.subName = $stateParams.subCatName;
    var allSets = $rootScope.quizQuestionSets
    var setIndex = parseFloat($stateParams.setIdx);

    if((allSets.length-1) > setIndex){
        vm.ifNextSet = true;
        vm.nextSetIndex = setIndex + 1;
        // User Review functionality could be implemented here
    }else{
        vm.ifNextSet = false;
        // User Review functionality could be implemented here
    }

    // End of finding next set






    // for result calculation
    var marks = {};
    marks.correct = 0;
    marks.wrong = 0;
    
    var temp = ResultFacotry.getResult();

    vm.lbButtonDisable = false;
    

    // Setting the backgroud color classs based on answer correctness
    for(var i = 0; i < temp.length; i++){
        if(temp[i].question.answer == temp[i].userAnswer){
            temp[i].bgColor = "bg-green";
            marks.correct += 1;
        }
        else{
            temp[i].bgColor = "bg-red";
            marks.wrong += 1;
        }
    }

    vm.results = temp;


    // Calculation of result
    
    marks.total = temp.length;
    marks.correctPercentage = marks.correct *  100 / marks.total;
    marks.wrongPercentage = marks.wrong *  100 / marks.total;
    var score = marks.correct - (marks.wrong * 0.50);
    marks.score = score < 0 ? 0:parseFloat(score);



    vm.marks = marks;

    // For chlering the the temp value in result facotry
    $scope.$on('$ionicView.beforeLeave', function() {
        //do stuff before enter
        // Initializing the localstorage result variable as empty
        $rootScope.temp = [];
    });



    // share modal modal
    $ionicModal.fromTemplateUrl('templates/modals/joinnlb-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        vm.modal = modal;
    });



     // Login page modal
    $ionicModal.fromTemplateUrl('templates/modals/login-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        vm.loginModal = modal;
    });




    // Join NLB
    vm.joinNLB = function(){
        if ($rootScope.user) {
            // User is signed in.
            // Share score into leaderboard
                vm.modal.show();
        } else { 
                vm.loginModal.show();
        }
    }



    





    // FB Login
    vm.fbLogin = function(){
        // vm.loginModal.hide();
        // var myconfig = {};
        // myconfig.fbClientId = "1746998085570124";
        // Auth.loginWithFacebook(myconfig).then(function(suc){
            
        //     ionicToast.show("Successfully signed in with Facebook", 'top', false, 2000);
        //     vm.modal.show();
        // },
        // function(err){
        //     vm.loginModal.hide();
        //     ionicToast.show("Something went wrong, please try agin", 'top', false, 2000);
        // });

        ngFB.login({ scope: 'email' }).then(
        function (response) {
            if (response.status === 'connected') {
                vm.loginModal.hide();
                ionicToast.show("ফেইসবুক দিয়ে লগইন সম্পন্ন হয়েছে", 'top', false, 2000);
                vm.modal.show();
 
                var credential = firebase.auth.FacebookAuthProvider.credential(
                    response.authResponse.accessToken);
 
                firebase.auth().signInWithCredential(credential).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // ...
                });
 
            } else {
                ionicToast.show("দুঃখিত, এই মুহূর্তে কোন কারণে ফেইসবুক দিয়ে লগইন করা সম্ভব হচ্ছেনা। দয়াকরে গুগল লগইন দিয়ে চেষ্টা করুন।", 'top', false, 3000);
            }
        },function(error){
            ionicToast.show("দুঃখিত, এই মুহূর্তে কোন কারণে ফেইসবুক দিয়ে লগইন করা সম্ভব হচ্ছেনা। দয়াকরে গুগল লগইন দিয়ে চেষ্টা করুন।", 'top', false, 3000);
        });
    }

    // Google login
    vm.googleLogin = function(){
        vm.loginModal.hide();
        var androidGoogleClientId = "251798023266-cok690t322r1njo6rk8rl38vi2od6mf9.apps.googleusercontent.com";
        Auth.loginWithGoogle(androidGoogleClientId).then(function(suc){
            ionicToast.show("গুগল দিয়ে লগইন সম্পন্ন হয়েছে", 'top', false, 2000);
            vm.modal.show();
        },
        function(err){
            alert(json.stringify(err))
            console.log("inside result controller");
            ionicToast.show("দুঃখিত, এই মুহূর্তে কোন কারণে গুগল দিয়ে লগইন করা সম্ভব হচ্ছেনা। দয়াকরে ফেইসবুক লগইন দিয়ে চেষ্টা করুন।", 'top', false, 3000);
        });
    }


    /// Login ended




    // Leader board score Share

    vm.goToLeaderboard = function(){

        // Checking network connection
        if(window.Connection) {
            if(navigator.connection.type == Connection.NONE) {
                firebase.database().goOffline();
                ionicToast.show("দুঃখিত আপনার ইন্টারনেট সংযোগ বিচ্ছিন্ন রয়েছে। ইন্টারনেট একটিভেট করে লিডারবোর্ডে যোগ দিয়ে সারা বাংলাদেশের মধ্যে আপনার অবস্থান দেখুন।", 'top', true, 2500);
            }
            else{
                firebase.database().goOnline();
                var leaderRef = firebase.database().ref().child("leaderboard/"+$rootScope.user.uid);
                var leadersRef = firebase.database().ref().child("leaderboard");


                var leader = $firebaseArray(leaderRef);


                leader.$loaded().then(
                    function(ref){
                        if(ref.length == 0){
                            var score = parseFloat(vm.marks.score);
                            var correctness = vm.marks.correctPercentage.toFixed(2);

                            leadersRef.child($rootScope.user.uid).set({

                                name: $rootScope.user.displayName,
                                email: $rootScope.user.email,
                                score: score.toFixed(2),
                                correctness: correctness,
                                photoURL: $rootScope.user.photoURL

                            }).then(function(response){
                                vm.modal.hide();
                                vm.lbButtonDisable = true;
                                ionicToast.show('আপনার স্কোর লিডারবোর্ডে যোগ হয়েছে। আপনার অবস্থান দেখার জন্য লিডারবোর্ড মেনু তে যান।', 'middle', false, 2500);
                            },function(error){
                                vm.modal.hide();
                                ionicToast.show('দুঃখিত আবার চেষ্টা করুন।', 'middle', false, 1000);
                            });

                        }  // End of if
                        else{
                            var oldCorrectness = parseFloat(ref[0].$value);
                            var oldScore = parseFloat(ref[3].$value);

                            var newCorrectness = (oldCorrectness + vm.marks.correctPercentage)/2;
                            var newScore = oldScore + parseFloat(vm.marks.score);

                            console.log(newCorrectness);
                            console.log(newScore);

                            var obj = $firebaseObject(leaderRef);
                            obj.$remove().then(function(result){
                                console.log("Deleted");
                                leadersRef.child($rootScope.user.uid).set({

                                        name: $rootScope.user.displayName,
                                        email: $rootScope.user.email,
                                        score: newScore.toFixed(2),
                                        correctness: newCorrectness.toFixed(2),
                                        photoURL: $rootScope.user.photoURL

                                    }).then(function(response){
                                        console.log("Newly Added from update func");
                                        vm.modal.hide();
                                        vm.lbButtonDisable = true;
                                        ionicToast.show("আপনার স্কোর লিডারবোর্ডে আপডেট হয়েছে। আপনার অবস্থান দেখার জন্য লিডারবোর্ড মেনু তে যান।", 'middle', false, 2500);
                                    },function(error){
                                        vm.modal.hide();
                                        ionicToast.show('দুঃখিত আবার চেষ্টা করুন।', 'middle', false, 1000);
                                    });
                            },
                            function(error){
                                vm.modal.hide();
                                ionicToast.show('দুঃখিত আবার চেষ্টা করুন।', 'middle', false, 1000);
                            });
                        } // End of else
                    }, // End ot ref function
                    function(error){
                        vm.modal.hide();
                        ionicToast.show('দুঃখিত আবার চেষ্টা করুন।', 'middle', false, 2000);
                    }// End of error funciton
                ); // End of then
            } //else
        }//if     


    } /// End of go to leaderboard funciton


    vm.backToQuiz = function(){
        $ionicHistory.goBack(-2);    
    }

}

})();