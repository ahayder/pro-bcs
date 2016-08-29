angular.module('app.studyController', [])

.controller('studyCtrl', ['$scope', '$stateParams', '$firebaseArray', '$ionicPopup', 'ionicToast', '$state', '$timeout', '$rootScope', 'ResultFacotry', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray, $ionicPopup, ionicToast, $state, $timeout, $rootScope, ResultFacotry, $ionicLoading) {
    $ionicLoading.show({
      template: '<ion-spinner icon="spiral"></ion-spinner>'
    });

    var qusRef = firebase.database().ref().child("questions");

    // Sate Params /quiz/:id/:subCatName/:qType/:startIdx/:endIdx
    $scope.subCatName = $stateParams.subName;
    console.log($stateParams.id);
    console.log($stateParams.subCatName);
    console.log($stateParams.startIdx);
    var start = parseInt($stateParams.startIdx) - 1;
    console.log("Start"+ start);
    console.log($stateParams.endIdx);
    var end = parseInt($stateParams.endIdx);
    console.log("End"+ end);



    // query
    var query = qusRef.orderByChild("subCatId").equalTo($stateParams.id);

    

    // Score
    $rootScope.score = {}
    $rootScope.score.mark = 0;

    var allQtns = $firebaseArray(query);

    

    // Suffle function
    var shuffle = function(array) {
        var m = array.length, t, i;

        // While there remain elements to shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    }


    // arrray index number of the currently showing question
    $scope.currentIndexNum = 0;


    // Doing a shuffle for options and answer
    allQtns.$loaded(function(allqs){

        var rangedQtns = allqs.slice(start, end);

        // Total questions in this subcategory
        $scope.totalQuestions = rangedQtns.length;
        console.log($scope.totalQuestions)

        // Shuffling all questions
        $scope.allQuestions = shuffle(rangedQtns);

        // Shuffling respective question's answers
        var tempOptionsArray = [
                                {title: $scope.allQuestions[$scope.currentIndexNum].option1, selected: false},
                                {title: $scope.allQuestions[$scope.currentIndexNum].option2, selected: false},
                                {title: $scope.allQuestions[$scope.currentIndexNum].option3, selected: false},
                                {title: $scope.allQuestions[$scope.currentIndexNum].answer, selected: false}
                                ];
        
        $scope.options = shuffle(tempOptionsArray);

        $ionicLoading.hide();

                                
    },
    function(error){
        $ionicLoading.hide().then(function(){
            ionicToast.show("Sorry something went wrong! Please try again.", 'top', false, 2000);
            console.log("The loading indicator is now hidden");
        });
    });


    $scope.next = function(){

        if($scope.allQuestions.length == ($scope.currentIndexNum + 1) ){
            return;
        }
        else{
            $scope.currentIndexNum++;

            // Shuffling next question's answers
                var tempOptionsArray = [
                                {title: $scope.allQuestions[$scope.currentIndexNum].option1, selected: false},
                                {title: $scope.allQuestions[$scope.currentIndexNum].option2, selected: false},
                                {title: $scope.allQuestions[$scope.currentIndexNum].option3, selected: false},
                                {title: $scope.allQuestions[$scope.currentIndexNum].answer, selected: false}
                                ];
        
            $scope.options = shuffle(tempOptionsArray);
        }
           
    }


    $scope.previous = function(){

        if($scope.currentIndexNum == 0){
            return;
        }
        else{
            $scope.currentIndexNum--;
                // Shuffling next question's answers
                var tempOptionsArray = [
                                {title: $scope.allQuestions[$scope.currentIndexNum].option1, selected: false},
                                {title: $scope.allQuestions[$scope.currentIndexNum].option2, selected: false},
                                {title: $scope.allQuestions[$scope.currentIndexNum].option3, selected: false},
                                {title: $scope.allQuestions[$scope.currentIndexNum].answer, selected: false}
                                ];
        
            $scope.options = shuffle(tempOptionsArray);
        }
        
    }





    $scope.showAnswer = function(options){

        for(var i = 0 ; i < options.length; i++){
            if($scope.allQuestions[$scope.currentIndexNum].answer == options[i].title){
                console.log(options[i].title);
                $scope.rightAnswer = options[i].title;
            }
        }

    }
    


}])