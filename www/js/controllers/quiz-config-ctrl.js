
angular.module('app.quizConfigController', [])

.controller('quizConfigCtrl', ['$scope', '$stateParams', '$firebaseArray', '$ionicPopup', 'ionicToast', '$state', '$timeout', '$rootScope', 'ResultFacotry', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray, $ionicPopup, ionicToast, $state, $timeout, $rootScope, ResultFacotry, $ionicLoading) {
    
    $ionicLoading.show({
      template: 'Loading...'
    });

    var qusRef = firebase.database().ref().child("questions");
    var query = qusRef.orderByChild("subCatId").equalTo($stateParams.id);

    
    // Subcat name
    var sub = $stateParams.subName;
    var id = $stateParams.id;

    $scope.data = {};
    $scope.data.title = sub;
    $scope.data.id = id;

    
    // All questions
    var allQtns = $firebaseArray(query);

    
    allQtns.$loaded(function(allqs){
        // Total questions in this subcategory
        $scope.totalQuestions = allqs.length;

        // Range system
        var interval = 3;

        var questionsChunks = Math.floor(allqs.length / interval);

        var tempArray = [];
        var tempObj = {};
        var start = 1;
        var end = interval;
        
        if(allqs.length % interval){
            // if there is mod value
            for(var i = 0; i < questionsChunks; i++){
                
                var tempObj = {};
                tempObj.starting = start;
                tempObj.ending = end;
                tempArray.push(tempObj);
                
                if(i != questionsChunks-1){
                    start += interval;
                    end += interval;
                }
                
             }
             start += interval;
             end = end + (allqs.length % interval);
             var tempObj = {};
             tempObj.starting = start;
             tempObj.ending = end;
             tempArray.push(tempObj);

        }
        else{
            // if no mod value
            for(var i = 0; i < questionsChunks; i++){
                
                var tempObj = {};
                tempObj.starting = start;
                tempObj.ending = end;
                tempArray.push(tempObj);
                start += interval;
                end += interval;

             }
        }

        $scope.ranges = tempArray;
        // End of  // Range system




        $ionicLoading.hide();                         
    },
    function(error){
        $ionicLoading.hide().then(function(){
            ionicToast.show("Sorry something went wrong! Please try again.", 'top', false, 2000);
        });
    });



    $scope.test = function(type, range){
        console.log(type);
        console.log(range);
    }

    



}])