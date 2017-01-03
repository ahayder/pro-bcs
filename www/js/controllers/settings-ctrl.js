(function(){
  'use strict';

angular.module('app.settingsController', [])
.controller('settingsCtrl', settingsCtrl);

settingsCtrl.$inject = ['ionicToast', '$rootScope', '$ionicNavBarDelegate', '$state'];
function settingsCtrl(ionicToast, $rootScope, $ionicNavBarDelegate, $state) {

    var vm = this;

    $ionicNavBarDelegate.showBackButton(false);

    // Range system

    // This is for quiz range
    if(localStorage.getItem('quizQuestionsRange') !== null){
        vm.quizSelectedValue = parseInt(localStorage.getItem('quizQuestionsRange'));
    }
    else{
        vm.quizSelectedValue = 5;
    }
    // end of quiz range


    // This is for study range
    if(localStorage.getItem('studyQuestionsRange') !== null){
        vm.studySelectedValue = parseInt(localStorage.getItem('studyQuestionsRange'));
    }
    else{
        vm.studySelectedValue = 10;
    }
    // end of study range



    vm.quizRanges = [5, 10, 15, 20, 25, 30, 50, 70, 100];

    vm.studyRanges = [5, 10, 15, 20, 25, 30, 50, 70, 100];


    vm.setForQuizRange = function(range){
        localStorage.setItem('quizQuestionsRange', range);
        $rootScope.quizQuestionsRange = localStorage.getItem('quizQuestionsRange');
  
    }

    vm.setForStudyRange = function(range){
        localStorage.setItem('studyQuestionsRange', range);
        $rootScope.studyQuestionsRange = localStorage.getItem('studyQuestionsRange');
    }


    vm.save = function(){
        ionicToast.show("সেভ হয়েছে।", 'top', false, 1000);
        $state.go('quizWay', {}, { reload: true });
    }

}

})();