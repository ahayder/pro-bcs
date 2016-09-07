angular.module('app.quizController', [])

.controller('quizCtrl', ['$scope', '$stateParams', '$firebaseArray', '$ionicPopup', 'ionicToast', '$state', '$timeout', '$rootScope', 'ResultFacotry', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray, $ionicPopup, ionicToast, $state, $timeout, $rootScope, ResultFacotry, $ionicLoading) {
    // This if for result Factory resetting result array
    $rootScope.temp = [];

    $ionicLoading.show({
      template: '<ion-spinner icon="spiral"></ion-spinner>'
    });

    var qusRef = firebase.database().ref().child("questions");

    // Sate Params /quiz/:id/:subCatName/:qType/:startIdx/:endIdx
    $scope.subCatName = $stateParams.subName;
    // console.log($stateParams.id);
    // console.log($stateParams.subCatName);
    // console.log($stateParams.startIdx);
    



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





    // question set settings
    // question set settings

    // Making sets
    var sets = [];
    for(var i = 0; i < $rootScope.ranges.length; i++){
        var set = {};
        set.id = i; // It is for setting question set with range index inside $loaded
        set.starting = $rootScope.ranges[i].starting;
        set.ending = $rootScope.ranges[i].ending;
        var setNumber = i+1;
        set.value = "সেট "+ setNumber +"("+$rootScope.ranges[i].starting + " থেকে " + $rootScope.ranges[i].ending+ ")";
        sets.push(set);
    }
    $rootScope.quizQuestionSets = sets;
    // End of Making sets

    var setIndex = parseInt($stateParams.setIdx);
    $scope.setShowing = {};
    $scope.setShowing.selectedSet = sets[setIndex];
    
    $scope.fixSet = function(){
        // var storageSet = JSON.stringify($scope.selectedSet);
        //localStorage.setItem('selectedSet', storageSet);
        console.log($scope.setShowing);
        $state.go("quiz", {id: $stateParams.id, subCatName: $stateParams.subName, setIdx: $scope.setShowing.selectedSet.id});
    }

    // end of question set settings
    // end of question set settings





    // arrray index number of the currently showing question
    $scope.currentIndexNum = 0;


    // Question from index to index
    //console.log($rootScope.ranges);
    var start = parseInt($rootScope.ranges[setIndex].starting) -1;
    var end = parseInt($rootScope.ranges[setIndex].ending);

    

    
    // Doing a shuffle for options and answer
    allQtns.$loaded(function(allqs){

        
        var rangedQtns = allqs.slice(start, end);

        // Total questions in this subcategory
        $scope.totalQuestions = rangedQtns.length;
        //console.log($scope.totalQuestions)

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


    


    // Checking answer    
    $scope.checkAnswer = function(userAns){

        // saving into result
        var singleQuestion = {};
        singleQuestion.question = $scope.allQuestions[$scope.currentIndexNum];
        singleQuestion.userAnswer = userAns;
        console.log(singleQuestion);
        ResultFacotry.saveResult(singleQuestion);  

        // If Right asnwer
        if($scope.allQuestions[$scope.currentIndexNum].answer == userAns){
            ////console.log("Right");

            $rootScope.score.mark += 1;
            var rightAnsAlert = $ionicPopup.show({
                    title: '<h3 class="title light">সাবাস বাঘের বাচ্চা!</h3>',
                    cssClass: 'right-answer',
                    template: '<h5 class="title light" style="text-align:center;">উত্তর সঠিক</h5>'
                });
            
            $timeout(function() {
                rightAnsAlert.close(); //close the popup after specified seconds for some reason
            }, 1000);

            $scope.count.right++;

            // checking whether no more questions available
            if($scope.allQuestions.length == $scope.currentIndexNum+1){

                $timeout(function() {
                    //ionicToast.show("You've completed all the questions in this category", 'top', false, 2000);
                    $state.go("result", {subId: $stateParams.id, subCatName: $scope.subCatName, setIdx: setIndex});
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
            $rootScope.score.mark = $rootScope.score.mark <= 0 ? 0 : $rootScope.score.mark-0.50;
            //console.log("ভুল! সঠিক উত্তরঃ " + $scope.allQuestions[$scope.currentIndexNum].answer);

            //ionicToast.show("Wrong! Right answer is " + $scope.allQuestions[$scope.currentIndexNum].answer, 'bottom', false, 2500);
            var wrongAnsAlert = $ionicPopup.show({
                    title: '<h3 class="title light">ভুল!</h3>',
                    cssClass: 'wrong-answer',
                    template: '<h5 class="title light" style="text-align:center;">'+'সঠিক উত্তরঃ ' + $scope.allQuestions[$scope.currentIndexNum].answer+'</h5>'
                });
            
            $timeout(function() {
                wrongAnsAlert.close(); //close the popup after specified seconds for some reason
            }, 2500);


            $scope.count.wrong++;
            // checking whether no more questions available
            if($scope.allQuestions.length == $scope.currentIndexNum+1){

                $timeout(function() {
                    //ionicToast.show("You've completed all the questions in this category", 'top', false, 2000);
                    $state.go("result", {subId: $stateParams.id, subCatName: $scope.subCatName, setIdx: setIndex});
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