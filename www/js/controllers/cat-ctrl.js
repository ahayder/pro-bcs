(function(){
  'use strict';

  angular.module('app.categoriesController', [])

  .controller('categoriesCtrl', categoriesCtrl);
  
  categoriesCtrl.$inject = ['$scope', '$timeout', '$ionicHistory', '$state', 'Categories', 'UpdateFactory', '$ionicLoading', 'ionicToast', '$ionicModal'];

  function categoriesCtrl($scope, $timeout, $ionicHistory, $state, Categories, UpdateFactory, $ionicLoading, ionicToast, $ionicModal) {

    var vm = this;

    // Questions Loading
    $ionicLoading.show({
      template: '<ion-spinner icon="spiral"></ion-spinner>'
    });
  
    $timeout(function() {
                $ionicLoading.hide();
            }, 1500);

    // goin to quiz or Study
    console.log($state);
    if($state){
        if($state.current.name == "quizWay"){
          vm.way = "কুইজ";
            
        }else{
          vm.way = "স্টাডি";  
        }
    }else{
        vm.way = "কুইজ";
    }

    var allcats = Categories.getAllCats();
    
    allcats[0].examTotalMarks = "৩৫";
    allcats[1].examTotalMarks = "৩৫";
    allcats[2].examTotalMarks = "৩০";
    allcats[3].examTotalMarks = "২০";
    allcats[4].examTotalMarks = "১০";
    allcats[5].examTotalMarks = "১৫";
    allcats[6].examTotalMarks = "১৫";
    allcats[7].examTotalMarks = "১৫";
    allcats[8].examTotalMarks = "১৫";
    allcats[9].examTotalMarks = "১০";
    
    
    vm.cats = allcats;


    // Questions Loading


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
        ionicToast.show("দুঃখিত ক্যাটাগরি আপডেট হয়নি! আবার চেষ্টা করুন।", 'top', false, 1000);
        $ionicLoading.hide();
      });
    };// end of cats update


    
    // Update App
    vm.updateApp = function(){
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



    var initModal = function(subject){
      $ionicModal.fromTemplateUrl('templates/modals/syl-modals/'+subject+'.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        vm.modal = modal;
        vm.modal.show();
      });
    }

    vm.showSyllabus = function(index){
      var subject = "";
      
      switch(index) {
        case 0:
          subject = "bangla";
          initModal(subject);
          break;
        case 1:
          subject = "english";
          initModal(subject);
          break;
        case 2:
          subject = "bangladesh";
          initModal(subject);
          break;
        case 3:
          subject = "international";
          initModal(subject);
          break;
        case 4:
          subject = "geography";
          initModal(subject);
          break;
        case 5:
          subject = "general-science";
          initModal(subject);
          break;
        case 6:
          subject = "computer";
          initModal(subject);
          break;
        case 7:
          subject = "math";
          initModal(subject);
          break;
        case 8:
          subject = "mental-ability";
          initModal(subject);
          break;
        case 9:
          subject = "ethics";
          initModal(subject);
      }
    }

    vm.closeModal = function(){
      vm.modal.hide();
      $scope.$on('$destroy', function() {
        vm.modal.remove();
      });
    }

  }

})();