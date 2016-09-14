// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', 
['ionic', 
'ngCordova',
'app.quizController', 
'app.resultController', 
'app.settingsController', 
'app.studyController', 
'app.loginController', 
'app.leaderboardController',
'app.categoriesController',
'app.feedbackController',
'app.subController',
'app.hotController',
'app.routes', 
'app.directives',
'app.initFactory',
'app.updateFactory',
'app.resultFactory',
'app.authFactory',
'app.subFactory',
'app.quesFactory',
'app.catsFactory',
'firebase', 
'ionic-toast', 
'ngCordovaOauth', 
'ngOpenFB',
'ngStorage'])

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

    // Checking network connection
    if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
            firebase.database().goOffline();
            console.log("offline");
        }
        else{
          console.log("online");
        }
    }// Checking network connection

    // Admob code
    if(window.plugins && window.plugins.AdMob) {
        //var admob_key = device.platform == "Android" ? "ca-app-pub-9736917302037050/1857374724" : "IOS_PUBLISHER_KEY";
        var admob_key = "ca-app-pub-9736917302037050/1857374724";
        var admob = window.plugins.AdMob;
        admob.createBannerView( 
            {
                'publisherId': admob_key,
                'adSize': admob.AD_SIZE.BANNER,
                'bannerAtTop': false,
                'overlap': false, // set to true, to allow banner overlap webview
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
      //console.log($rootScope.user);
      if($rootScope.user == null){
        var uid = " ";
      }
      else{
        var uid = user.uid;
      }
      
      var leaderRef = firebase.database().ref().child("leaderboard/"+uid);
      $rootScope.leader = $firebaseObject(leaderRef);
      //console.log($rootScope.leader);
  });

  

  // Initialization
  $rootScope.placeholderImage = "img/profile.jpg"

  // This is for quiz range
  if(localStorage.getItem('quizQuestionsRange') !== null){
    //console.log("Yes range quiz");
    //console.log(localStorage.getItem('quizQuestionsRange'));
    $rootScope.quizQuestionsRange = localStorage.getItem('quizQuestionsRange');
  }
  else{
    //console.log("NO range quiz");
    localStorage.setItem('quizQuestionsRange',"5");
    //console.log(localStorage.getItem('quizQuestionsRange'));
    $rootScope.quizQuestionsRange = localStorage.getItem('quizQuestionsRange');
  }
  // end of quiz range


  // This is for study range
  if(localStorage.getItem('studyQuestionsRange') !== null){
    //console.log("Yes range study");
    //console.log(localStorage.getItem('studyQuestionsRange'));
    $rootScope.studyQuestionsRange = localStorage.getItem('studyQuestionsRange');
  }
  else{
    //console.log("NO range study");
    localStorage.setItem('studyQuestionsRange',"10");
    //console.log(localStorage.getItem('studyQuestionsRange'));
    $rootScope.studyQuestionsRange = localStorage.getItem('studyQuestionsRange');
  }
  // end of study range

  $rootScope.sound = false;


})


.controller('menuCtrl', ['$scope', '$ionicHistory', '$state', '$ionicLoading', 'UpdateFactory', '$firebaseAuth', 'InitFactory', 'ionicToast', '$rootScope',
  function($scope, $ionicHistory, $state, $ionicLoading, UpdateFactory, $firebaseAuth, InitFactory, ionicToast, $rootScope){

  $scope.signOut = function(){
    $firebaseAuth().$signOut();
    ionicToast.show("Signed out", 'top', false, 2500);
  }

  // Init app with saved data in json file
  InitFactory.initCats();
  InitFactory.initSubCats();
  InitFactory.initQuestions();
  // End of Init app with saved data in json file

  // questioins update
  var updateQuestions = function(){
    UpdateFactory.getQuestionsFromFirebase().then(function(response){
      UpdateFactory.updateQuestions(response);
      $ionicLoading.hide();
      ionicToast.show("প্রশ্ন আপডেট হয়েছে", 'top', false, 1000);
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('quizWay', {}, { reload: true });
    },function(error){
      ionicToast.show("দুঃখিত প্রশ্ন আপডেট হয়নি! আবার চেষ্টা করুন।", 'top', false, 1000);
      $ionicLoading.hide();
    });
  };// end of questioins update

  // subcats update
  var updateSubCategories = function(){
    UpdateFactory.getSubCatsFromFirebase().then(function(response){
      UpdateFactory.updateSubCats(response);
      ionicToast.show("সাবক্যাটাগরি আপডেট হয়েছে", 'top', false, 1000);
      updateQuestions();
    },function(error){
      ionicToast.show("দুঃখিত সাবক্যাটাগরি আপডেট হয়নি! আবার চেষ্টা করুন।", 'top', false, 1000);
      $ionicLoading.hide();
    });
  };// end of subcats update

  // cats update
  var updateCategories = function(){
    UpdateFactory.getCatsFromFirebase().then(function(response){
      UpdateFactory.updateCats(response);
      ionicToast.show("ক্যাটাগরি আপডেট হয়েছে", 'top', false, 1000);
      updateSubCategories();
    },function(error){
      ionicToast.show("দুঃখিত ক্যাটাগরি আপডেট হয়নি! আবার চেষ্টা করুন।", 'top', false, 1000);
      $ionicLoading.hide();
    });
  };// end of cats update


  
  // Update App
  $scope.updateApp = function(){
    $ionicLoading.show({
      template: '<ion-spinner icon="spiral"></ion-spinner>'
    });

    // Checking network connection
    if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
            firebase.database().goOffline();
            $ionicLoading.hide();
            ionicToast.show("দুঃখিত ইন্টারনেট সংযোগ বিচ্ছিন্ন রয়েছে। ইন্টারনেট একটিভেট করে আবার চেষ্টা করুন।", 'top', false, 2000);
        }
        else{
          updateCategories();
        }
    }
        
  }// Update App
  

}])


.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
});