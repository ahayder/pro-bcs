angular.module('app.authFactory', [])

.factory('Auth', ['$cordovaOauth', function($cordovaOauth){
    return {
            loginWithGoogle : function (myConfig) {
                console.log("inside auth factory loginWithGoogle function");
                if(ionic.Platform.isWebView()){
                    console.log("inside auth factory loginWithGoogle function if");
                    return $cordovaOauth.google(myConfig + '&include_profile=true', ["email", "profile"]).then(function (result) {
                        var credential = firebase.auth.GoogleAuthProvider.credential(result.id_token);
                        return firebase.auth().signInWithCredential(credential);
                    },function(error){
                        alert(JSON.stringify(error));
                    })
                }
                else{
                    console.log("inside auth factory loginWithGoogle function else");
                    var provider = new firebase.auth.GoogleAuthProvider();
                    provider.addScope('email');
                    provider.addScope('profile');
                    return firebase.auth().signInWithPopup(provider);
                }
            },
			loginWithFacebook : function (myConfig) {
                if(ionic.Platform.isWebView()){
                    return $cordovaOauth.facebook(myConfig.fbClientId, ["email"]).then(function (result) {
                        var credential = firebase.auth.FacebookAuthProvider.credential(result.id_token);
                        return firebase.auth().signInWithCredential(credential);
                    });
                }
                else{
                    var provider = new firebase.auth.FacebookAuthProvider();
                    provider.addScope('email');
                    //provider.addScope('profile');
                    return firebase.auth().signInWithPopup(provider);
                }
            }
        };
}]);