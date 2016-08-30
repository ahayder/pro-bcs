// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.quizController', 'app.resultController', 'app.quizConfigController', 'app.studyController', 'app.loginController', 'app.leaderboardController', 'app.routes', 'app.directives','app.services', 'firebase', 'ionic-toast', 'ngCordovaOauth', 'ngOpenFB'])

.run(function($ionicPlatform, $rootScope, $firebaseAuth, ngFB, $firebaseObject) {
  ngFB.init({appId: '1746998085570124'});
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // Admob code
    if(window.plugins && window.plugins.AdMob) {
        //var admob_key = device.platform == "Android" ? "ca-app-pub-9736917302037050/1857374724" : "IOS_PUBLISHER_KEY";
        var admob_key = "ca-app-pub-9736917302037050/1857374724";
        var admob = window.plugins.AdMob;
        admob.createBannerView( 
            {
                'publisherId': admob_key,
                'adSize': admob.AD_SIZE.BANNER,
                'bannerAtTop': false
            }, 
            function() {
                admob.requestAd(
                    { 'isTesting': false }, 
                    function() {
                        admob.showAd(true);
                    }, 
                    function() { alert('failed to request ad'); }
                );
            }, 
            function() { alert('failed to create banner view'); }
        );
    }
    // End of Admob code

  });

  $firebaseAuth().$onAuthStateChanged(function(user) {
      $rootScope.user = user;
      console.log($rootScope.user);
      if($rootScope.user == null){
        var uid = " ";
      }
      else{
        var uid = user.uid;
      }
      
      var leaderRef = firebase.database().ref().child("leaderboard/"+uid);
      $rootScope.leader = $firebaseObject(leaderRef);
      console.log($rootScope.leader);
  });

  $rootScope.placeholderImage = "img/profile.jpg"
})


.controller('menuCtrl', ['$scope', '$firebaseAuth', 'ionicToast', '$rootScope',
  function($scope, $firebaseAuth, ionicToast, $rootScope){

  $scope.signOut = function(){
    $firebaseAuth().$signOut();
    ionicToast.show("Signed out", 'top', false, 2500);

  }

  

}])

.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
});