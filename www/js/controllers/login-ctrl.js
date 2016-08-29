angular.module('app.loginController', [])

.controller('loginCtrl', ['$scope', '$stateParams', '$firebaseAuth', '$state', 'ionicToast', 'Auth', 'ngFB', '$ionicLoading',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseAuth, $state, ionicToast, Auth, ngFB) {

    // FB Login
    $scope.fbLogin = function(){
        // var myconfig = {};
        // myconfig.fbClientId = "1746998085570124";
        // Auth.loginWithFacebook(myconfig).then(function(suc){
        //     $state.go("bcsQuiz.categories");
        //     ionicToast.show("Successfully signed in with Facebook", 'top', false, 3000);
            
        // },
        // function(err){
        //     ionicToast.show("Something went wrong, please try agin", 'top', false, 2000);
        // });

        ngFB.login({ scope: 'email' }).then(
        function (response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded', response)
                $state.go("bcsQuiz.categories");
                ionicToast.show("Successfully signed in with Facebook", 'top', false, 3000);
 
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
                ionicToast.show("Something went wrong, please try agin", 'top', false, 2000);
            }
        },function(error){
            ionicToast.show("Something went wrong, please try agin", 'top', false, 2000);
        });




    }// End of fb login


    $scope.googleLogin = function(){
        $state.go("bcsQuiz.categories");
        var myconfig = {};
        myconfig.googleClientId = "251798023266-t2t4rp4jn5sn9l61q3kg7u5qd0rqtod8.apps.googleusercontent.com";
        Auth.loginWithGoogle(myconfig).then(function(suc){
            
            ionicToast.show("Successfully signed in with Google", 'top', false, 3000);
            
        },
        function(err){
            ionicToast.show("Something went wrong, please try agin", 'top', false, 2000);
        });
    }

    

}])