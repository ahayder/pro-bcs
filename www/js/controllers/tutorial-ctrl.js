angular.module('app.tutorialController', [])
.controller('tutorialCtrl', ['$scope', '$state', '$ionicSlideBoxDelegate', '$ionicHistory', function($scope, $state, $ionicSlideBoxDelegate, $ionicHistory) {
 
  // Called to navigate to the main app
  $scope.startApp = function() {
    $ionicHistory.nextViewOptions({
        disableBack: true
      });
    $state.go('quizWay');
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
}]);