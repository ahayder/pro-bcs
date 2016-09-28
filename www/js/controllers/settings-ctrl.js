
angular.module('app.settingsController', [])

.controller('settingsCtrl', ['$scope', 'ionicToast', '$rootScope', '$ionicNavBarDelegate', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, ionicToast, $rootScope, $ionicNavBarDelegate, $state) {

    $ionicNavBarDelegate.showBackButton(false);

    // Range system

    // This is for quiz range
    if(localStorage.getItem('quizQuestionsRange') !== null){
        $scope.quizSelectedValue = parseInt(localStorage.getItem('quizQuestionsRange'));
    }
    else{
        $scope.quizSelectedValue = 5;
    }
    // end of quiz range


    // This is for study range
    if(localStorage.getItem('studyQuestionsRange') !== null){
        $scope.studySelectedValue = parseInt(localStorage.getItem('studyQuestionsRange'));
    }
    else{
        $scope.studySelectedValue = 10;
    }
    // end of study range



    $scope.quizRanges = [5, 10, 15, 20, 25, 30, 50, 70, 100];

    $scope.studyRanges = [5, 10, 15, 20, 25, 30, 50, 70, 100];


    $scope.setForQuizRange = function(range){
        localStorage.setItem('quizQuestionsRange', range);
        $rootScope.quizQuestionsRange = localStorage.getItem('quizQuestionsRange');
  
    }

    $scope.setForStudyRange = function(range){
        localStorage.setItem('studyQuestionsRange', range);
        $rootScope.studyQuestionsRange = localStorage.getItem('studyQuestionsRange');
    }


    $scope.save = function(){
        ionicToast.show("Saved!", 'top', false, 1000);
        $state.go('quizWay', {}, { reload: true });
    }

}])