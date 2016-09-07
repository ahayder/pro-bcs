angular.module('app.services', [])

.factory('ResultFacotry', ['$rootScope', function($rootScope){
    $rootScope.temp = [];

    return{
        saveResult: function(resultData){
            if(localStorage.getItem('results')==null){
				localStorage.setItem('results',[]);
				//console.log("First if working")
			}
            if(localStorage.getItem('results').length>0){
				$rootScope.temp = JSON.parse(localStorage.getItem('results'));
				$rootScope.temp.push(resultData);
				localStorage.setItem('results',JSON.stringify($rootScope.temp));
				//console.log("Second if working")
			}
			else{
				$rootScope.temp.push(resultData);
				localStorage.setItem('results',JSON.stringify($rootScope.temp));
				//console.log("Else if working")
			}
        },
        getResult: function(){

		    temp = JSON.parse(localStorage.getItem('results'));

			return $rootScope.temp;
        }
    }
}])

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
}])

.service('BlankService', [function(){

}]);