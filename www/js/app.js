// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
(function(){
  'use strict';

  angular.module('app', 
  ['ionic', 
  'ngCordova',
  'app.tutorialController',
  'app.quizController', 
  'app.resultController', 
  'app.settingsController', 
  'app.studyController', 
  'app.loginController', 
  'app.leaderboardController',
  'app.categoriesController',
  'app.feedbackController',
  'app.subController',
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

      // admob banner code
      var banner_key = "ca-app-pub-9736917302037050/1857374724";
      try{
        if(AdMob) AdMob.createBanner({
          adId: banner_key,
          position: AdMob.AD_POSITION.BOTTOM_CENTER,
          autoShow: true,
          isTesting: false,
          overlap: false
        });
      }
      catch(error){
        console.log(error.message);
      }
      
      // End of Admob code


      // Onesignal Push
      // Enable to debug issues.
      // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
      
      var notificationOpenedCallback = function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      };

      try{
        window.plugins.OneSignal
          .startInit("ac0b7a9a-f673-440b-9e94-cdb2c9f5707e", "1079579771862")
          .handleNotificationOpened(notificationOpenedCallback)
          .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
          .endInit();
      }
      catch(error){
        console.log(error.message);
      }

      // End of one signal push






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

    }); // end of platform ready

    // Checking for login & assinging the leaderboard
    $firebaseAuth().$onAuthStateChanged(function(user) {
        if(!user){
          var uid = " ";
          $rootScope.user = user;
        }
        else{
          var uid = user.uid;
          $rootScope.user = user;
        }
        
        var leaderRef = firebase.database().ref().child("leaderboard/"+uid);
        $rootScope.leader = $firebaseObject(leaderRef);
    });// Checking for login & assinging the leaderboard
    


    
    

    

    // Initialization
    $rootScope.placeholderImage = "img/profile.jpg"

    // This is for quiz range
    if(localStorage.getItem('quizQuestionsRange') !== null){
      $rootScope.quizQuestionsRange = localStorage.getItem('quizQuestionsRange');
    }
    else{
      localStorage.setItem('quizQuestionsRange',"20");
      $rootScope.quizQuestionsRange = localStorage.getItem('quizQuestionsRange');
    }
    // end of quiz range


    // This is for study range
    if(localStorage.getItem('studyQuestionsRange') !== null){
      $rootScope.studyQuestionsRange = localStorage.getItem('studyQuestionsRange');
    }
    else{
      localStorage.setItem('studyQuestionsRange',"25");
      $rootScope.studyQuestionsRange = localStorage.getItem('studyQuestionsRange');
    }
    // end of study range

    $rootScope.sound = true;

  })


  .controller('menuCtrl', ['$scope', '$firebaseArray', '$timeout', '$ionicHistory', '$state', '$ionicLoading', 'UpdateFactory', '$firebaseAuth', 'InitFactory', 'ionicToast', '$rootScope',
    function($scope, $firebaseArray, $timeout, $ionicHistory, $state, $ionicLoading, UpdateFactory, $firebaseAuth, InitFactory, ionicToast, $rootScope){

    var subRef = firebase.database().ref().child("subCategories");
    var allSubs = $firebaseArray(subRef);
    


    $scope.signOut = function(){
      $firebaseAuth().$signOut();
      ionicToast.show("সাইন আউট হয়েছে", 'top', false, 2500);
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
        ionicToast.show("দুঃখিত প্রশ্ন আপডেট হয়নি, আবার চেষ্টা করুন।", 'top', false, 1000);
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
        ionicToast.show("দুঃখিত সাবক্যাটাগরি আপডেট হয়নি, আবার চেষ্টা করুন।", 'top', false, 1000);
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
        ionicToast.show("দুঃখিত ক্যাটাগরি আপডেট হয়নি, আবার চেষ্টা করুন।", 'top', false, 1000);
        $ionicLoading.hide();
      });
    };// end of cats update


    
    // Update App
    $scope.updateApp = function(){
      $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner><p>সার্ভার থেকে প্রশ্ন ডাউনলোড হচ্ছে। দয়া করে অপেক্ষা করুন। সাধারানত ২-৩ মিনিট এর মধ্যে ডাউনলোড হয়ে যায়। যদি তা না হয় তবে অ্যাপটি বন্ধ করে আবার চালু করুন।</p>'
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


    // /intro
    var introSettings = function(){
      if(localStorage.getItem('isFirstTime') == 'true' || localStorage.getItem('isFirstTime') == null){

        $timeout(function() {
                  $state.go("intro");
              });
        localStorage.setItem('isFirstTime', 'false');
        localStorage.setItem('isQuizFirstTime', 'true');
        console.log("tuts showing");
      }
    }

    introSettings();
  
    // end of intro
    

  }])


  .config(function ($httpProvider, $ionicConfigProvider) {

    $ionicConfigProvider.scrolling.jsScrolling(false);

    $ionicConfigProvider.views.transition("none");

    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};

  })

})();