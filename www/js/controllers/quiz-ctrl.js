angular.module('app.quizController', [])

.controller('quizCtrl', ['$scope', '$stateParams', '$firebaseArray', '$ionicPopup', 'ionicToast', '$state', '$timeout', '$rootScope', 'ResultFacotry', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray, $ionicPopup, ionicToast, $state, $timeout, $rootScope, ResultFacotry, $ionicLoading) {
    $ionicLoading.show({
      template: 'Loading...'
    });

    var qusRef = firebase.database().ref().child("questions");

    // Sate Params /quiz/:id/:subCatName/:qType/:startIdx/:endIdx
    $scope.subCatName = $stateParams.subName;
    console.log($stateParams.id);
    console.log($stateParams.subCatName);
    console.log($stateParams.qType);
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




    // Right or wrong answer
    $scope.count = {
        right: 0,
        wrong: 0
    }


    // Making a variable for storing data to show result
    var singleQuestion = {};

     // Initializing the localstorage result variable as empty
    localStorage.setItem('results',[]);

    // Checking answer    
    $scope.checkAnswer = function(userAns){

        // saving into result
        singleQuestion.question = $scope.allQuestions[$scope.currentIndexNum];
        singleQuestion.userAnswer = userAns;
        console.log(singleQuestion);
        ResultFacotry.saveResult(singleQuestion);  

        // If Right asnwer
        if($scope.allQuestions[$scope.currentIndexNum].answer == userAns){
            console.log("Right");

            $rootScope.score.mark += 1;
            var rightAnsAlert = $ionicPopup.show({
                    title: '<h3 class="title light">Congratz!</h3>',
                    cssClass: 'right-answer',
                    template: '<h5 class="title light">Answer is correct</h5>'
                });
            
            $timeout(function() {
                rightAnsAlert.close(); //close the popup after specified seconds for some reason
            }, 1000);

            $scope.count.right++;

            // checking whether no more questions available
            if($scope.allQuestions.length == $scope.currentIndexNum+1){

                $timeout(function() {
                    ionicToast.show("You've completed all the questions in this category", 'top', false, 2000);
                    $state.go("bcsQuiz.result", {subCatName: $scope.subCatName});
                }, 1000);
                

                return;
            }

            $timeout(function() {
                $scope.currentIndexNum++;
                // Shuffling next question's answers
                var tempOptionsArray = [
                                {title: $scope.allQuestions[$scope.currentIndexNum].option1, selected: false},
                                {title: $scope.allQuestions[$scope.currentIndexNum].option2, selected: false},
                                {title: $scope.allQuestions[$scope.currentIndexNum].option3, selected: false},
                                {title: $scope.allQuestions[$scope.currentIndexNum].answer, selected: false}
                                ];
        
                $scope.options = shuffle(tempOptionsArray);
            }, 1000);
            
            

            
        }
        // If Wrong Answer
        else{
            $rootScope.score.mark -= 1.25;
            console.log("Wrong! Right answer is " + $scope.allQuestions[$scope.currentIndexNum].answer);

            //ionicToast.show("Wrong! Right answer is " + $scope.allQuestions[$scope.currentIndexNum].answer, 'bottom', false, 2500);
            var wrongAnsAlert = $ionicPopup.show({
                    title: '<h3 class="title light">Oops!</h3>',
                    cssClass: 'wrong-answer',
                    template: '<h5 class="title light">'+'Right answer is ' + $scope.allQuestions[$scope.currentIndexNum].answer+'</h5>'
                });
            
            $timeout(function() {
                wrongAnsAlert.close(); //close the popup after specified seconds for some reason
            }, 2500);


            $scope.count.wrong++;
            // checking whether no more questions available
            if($scope.allQuestions.length == $scope.currentIndexNum+1){

                $timeout(function() {
                    ionicToast.show("You've completed all the questions in this category", 'top', false, 2000);
                    $state.go("bcsQuiz.result", {subCatName: $scope.subCatName});
                }, 1000);
                
                return;
            }

            $timeout(function() {
                $scope.currentIndexNum++;
                // Shuffling next question's answers
                var tempOptionsArray = [
                                {title: $scope.allQuestions[$scope.currentIndexNum].option1, selected: false},
                                {title: $scope.allQuestions[$scope.currentIndexNum].option2, selected: false},
                                {title: $scope.allQuestions[$scope.currentIndexNum].option3, selected: false},
                                {title: $scope.allQuestions[$scope.currentIndexNum].answer, selected: false}
                                ];
        
                $scope.options = shuffle(tempOptionsArray);
            }, 2500);
            

            
        }

        
    } // End of check answer function
    


}])