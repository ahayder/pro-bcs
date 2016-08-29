
angular.module('app.quizConfigController', [])

.controller('quizConfigCtrl', ['$scope', '$stateParams', '$firebaseArray', '$ionicActionSheet', 'ionicToast', '$state', '$timeout', '$rootScope', 'ResultFacotry', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray, $ionicActionSheet, ionicToast, $state, $timeout, $rootScope, ResultFacotry, $ionicLoading) {
    
    $ionicLoading.show({
      template: '<ion-spinner icon="spiral"></ion-spinner>'
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

    
    
    // Range system

    $scope.dropdownRanges = [
        {value: 5},
        {value: 10},
        {value: 20},
        {value: 25},
        {value: 30},
        {value: 50},
        ];

    $scope.selectedValue = 30;

    $scope.getRange = function(range){
        console.log(range);
        var interval = parseInt(range);


        allQtns.$loaded(function(allqs){
            // Total questions in this subcategory
            $scope.totalQuestions = allqs.length;

            // If interval or range is bigger than all questions length
            if(allqs.length <= interval){
                //console.log("Working");
                var tempArray = [];
                var tempObj = {};
                
                tempObj.starting = 1;
                tempObj.ending = allqs.length;
                //console.log(tempObj);
                tempArray.push(tempObj);
                $scope.ranges = tempArray;
                //console.log($scope.ranges);

            } // End of if bigger than all questions length
            else if(allqs.length % interval){ // if mod value

                var questionsChunks = Math.floor(allqs.length / interval);
                var tempArray = [];
                var start = 1;
                var end = interval;
                // without the mod value
                for(var i = 0; i < questionsChunks; i++){
                    
                    var anotherTempObj = {};
                    anotherTempObj.starting = start;
                    anotherTempObj.ending = end;
                    tempArray.push(anotherTempObj);
                    
                    // Stopping the incremant for the last time
                    if(i != questionsChunks-1){
                        start += interval;
                        end += interval;
                        console.log(start);
                        console.log(end);
                    }
                    
                }
                start += interval;
                end = end + (allqs.length % interval);
                console.log(start);
                console.log(end);
                var tempObj = {};
                tempObj.starting = start;
                tempObj.ending = end;
                tempArray.push(tempObj);

                $scope.ranges = tempArray;

            }
            else{ // if no mod value
                var questionsChunks = Math.floor(allqs.length / interval);
                var tempArray = [];
                var tempObj = {};
                var start = 1;
                var end = interval;
                
                for(var i = 0; i < questionsChunks; i++){
                    var tempObj = {};
                    tempObj.starting = start;
                    tempObj.ending = end;
                    tempArray.push(tempObj);
                    start += interval;
                    end += interval;

                }
                $scope.ranges = tempArray;
            } //End of else(allqs.length % interval)

            
            $ionicLoading.hide();

            },
            function(error){
                $ionicLoading.hide().then(function(){
                    ionicToast.show("Sorry something went wrong! Please try again.", 'top', false, 2000);
                });
            }); // End of allQtns.$loaded

    } // End ot get range 
    
    // End of  // Range system

    $scope.getRange($scope.selectedValue);

    

    
    



    $scope.go = function(subId, subTitle, type, range){
        console.log(subId + subTitle + type + range )

        if(type == 'quiz'){
            $state.go("bcsQuiz.quiz", {id: subId, subCatName: subTitle, startIdx: range.starting, endIdx: range.ending});
        }
        else{
            $state.go("bcsQuiz.study", {id: subId, subCatName: subTitle, startIdx: range.starting, endIdx: range.ending});
        }
    }



    // Triggered on a button click, or some other target
    $scope.showActionSheet = function(rangeValue) {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
            { text: 'কুইজ' },
            { text: 'স্টাডি' }
            ],
            titleText: 'যে কোন একটি সিলেক্ট করুন',
            cancelText: 'বাতিল',
            cancel: function() {
                // add cancel code..
                },
            buttonClicked: function(index) {
                if(index == 0){
                    $scope.go($scope.data.id, $scope.data.title, 'quiz', rangeValue)
                }
                else{
                    $scope.go($scope.data.id, $scope.data.title, 'study', rangeValue)
                }
                
            }
        });

    };
    



}])