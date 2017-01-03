(function(){
  'use strict';

  angular.module('app.tutorialController', [])
  .controller('tutorialCtrl', tutorialCtrl)
  .controller('introCtrl', introCtrl);

  tutorialCtrl.$inject = ['$state', '$ionicSlideBoxDelegate', '$ionicHistory'];
  function tutorialCtrl($state, $ionicSlideBoxDelegate, $ionicHistory) {
    
    var vm = this;
    // Called to navigate to the main app
    vm.startApp = function() {
      $ionicHistory.nextViewOptions({
          disableBack: true
        });
      $state.go('quizWay');
    };
    vm.next = function() {
      $ionicSlideBoxDelegate.next();
    };
    vm.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    vm.slideChanged = function(index) {
      vm.slideIndex = index;
    };
  }

  
  
  introCtrl.$inject = ['$state', '$ionicSlideBoxDelegate', '$ionicHistory', 'ionicToast', '$ionicLoading', 'UpdateFactory'];
  function introCtrl($state, $ionicSlideBoxDelegate, $ionicHistory, ionicToast, $ionicLoading, UpdateFactory){

    var vm = this;
  
    // Called to navigate to the main app
    vm.startApp = function() {
      $ionicHistory.nextViewOptions({
          disableBack: true
        });
      $state.go('quizWay');
    };
    vm.next = function() {
      $ionicSlideBoxDelegate.next();
    };
    vm.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    vm.slideChanged = function(index) {
      vm.slideIndex = index;
    };

    // questioins update
    function updateQuestions(){
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
    function updateSubCategories(){
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
    function updateCategories(){
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
    vm.updateApp = function(){
      $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner><p>সার্ভার থেকে প্রশ্ন ডাউনলোড হচ্ছে। দয়া করে অপেক্ষা করুন।</p>'
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

  }

})();