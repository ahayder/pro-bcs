(function(){
  'use strict';

    angular.module('app.loginController', [])

    .controller('loginCtrl', ['$scope', '$firebaseAuth', '$state', 'ionicToast', 'Auth', 'ngFB', '$cordovaOauth', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $firebaseAuth, $state, ionicToast, Auth, ngFB, $cordovaOauth) {

        // FB Login
        $scope.fbLogin = function(){
            // var myconfig = {};
            // myconfig.fbClientId = "1746998085570124";
            // Auth.loginWithFacebook(myconfig).then(function(suc){
            //     $state.go("quizWay");
            //     ionicToast.show("Successfully signed in with Facebook", 'top', false, 3000);
                
            // },
            // function(err){
            //     ionicToast.show("Something went wrong, please try agin", 'top', false, 2000);
            // });

            ngFB.login({ scope: 'email' }).then(
                function (response) {
                    if (response.status === 'connected') {
                        $state.go("quizWay");
                        ionicToast.show("ফেইসবুক দিয়ে লগইন সম্পন্ন হয়েছে", 'top', false, 3000);
        
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
                        ionicToast.show("দুঃখিত, এই মুহূর্তে কোন কারণে ফেইসবুক দিয়ে লগইন করা সম্ভব হচ্ছেনা। দয়াকরে গুগল লগইন দিয়ে চেষ্টা করে দেখুন।", 'top', false, 3000);
                    }
                },function(error){
                    ionicToast.show("দুঃখিত, এই মুহূর্তে কোন কারণে ফেইসবুক দিয়ে লগইন করা সম্ভব হচ্ছেনা। দয়াকরে গুগল লগইন দিয়ে চেষ্টা করে দেখুন।", 'top', false, 3000);
                });// end of ngFB.login

        }// End of fb login


        $scope.googleLogin = function(){
            
            var androidGoogleClientId = "251798023266-cok690t322r1njo6rk8rl38vi2od6mf9.apps.googleusercontent.com";
            Auth.loginWithGoogle(androidGoogleClientId).then(function(suc){
                $state.go("quizWay");
                ionicToast.show("গুগল দিয়ে লগইন সম্পন্ন হয়েছে", 'top', false, 3000);
            },
            function(err){
                // alert(JSON.stringify(err))
                console.log(err);
                console.log("inside login controller");
                ionicToast.show("দুঃখিত, এই মুহূর্তে কোন কারণে গুগল দিয়ে লগইন করা সম্ভব হচ্ছেনা। দয়াকরে ফেইসবুক লগইন দিয়ে চেষ্টা করে দেখুন।", 'top', false, 3000);
            });
        }

        

    }])

})();