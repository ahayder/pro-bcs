angular.module('app.authFactory', [])

.factory('Auth', ['$cordovaOauth', function($cordovaOauth){
    return {
            loginWithGoogle : function (myConfig) {
                if(ionic.Platform.isWebView()){
                    return $cordovaOauth.google(myConfig.googleClientId + '&include_profile=true', ["email", "profile"]).then(function (result) {
                        var credential = firebase.auth.GoogleAuthProvider.credential(result.id_token);
                        return firebase.auth().signInWithCredential(credential);
                    });
                }
                else{
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