angular.module('app.subController', [])

.controller('subCategoriesCtrl', ['$scope', '$stateParams', '$firebaseArray', '$ionicLoading', '$firebaseObject', '$ionicHistory', '$state', '$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray, $ionicLoading, $firebaseObject, $ionicHistory, $state, $rootScope) {

    $ionicLoading.show({
      template: '<ion-spinner icon="spiral"></ion-spinner>'
    });
    
    var subCatRef = firebase.database().ref().child("subCategories");
    var query = subCatRef.orderByChild("mainCatId").equalTo($stateParams.id);
    $scope.subs = $firebaseArray(query);



    $scope.subs.$loaded().then(function(ref){
        $ionicLoading.hide();
    },function(error){
        $ionicLoading.hide().then(function(){
            ionicToast.show("Sorry something went wrong! Please try again.", 'top', false, 2000);
            console.log("The loading indicator is now hidden");
        });
    });


    // init qestion set
    $scope.initQuestionsSets = function(way, subId, subTitle){

        $ionicLoading.show({
            template: '<ion-spinner icon="spiral"></ion-spinner>'
        });

        if(way == "quizWay"){
            var interval = parseInt($rootScope.quizQuestionsRange);
            console.log(interval);
        }
        else{
            var interval = parseInt($rootScope.studyQuestionsRange);
            console.log(interval);
        }
        


        // All questions
        var qusRef = firebase.database().ref().child("questions");
        var queryForQuestion = qusRef.orderByChild("subCatId").equalTo(subId);
        var allQtns = $firebaseArray(queryForQuestion);
        
        allQtns.$loaded(function(allqs){
            // Total questions in this subcategory
            $scope.totalQuestions = allqs.length;
            //console.log(allqs);

            // If interval or range is bigger than all questions length
            if(allqs.length <= interval){
                //console.log("Working");
                var tempArray = [];
                var tempObj = {};
                
                tempObj.starting = 1;
                tempObj.ending = allqs.length;
                //console.log(tempObj);
                tempArray.push(tempObj);
                $rootScope.ranges = tempArray;
                //console.log($rootScope.ranges);

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
                        //console.log(start);
                        //console.log(end);
                    }
                    
                }
                start += interval;
                end = end + (allqs.length % interval);
                //console.log(start);
                //console.log(end);
                var tempObj = {};
                tempObj.starting = start;
                tempObj.ending = end;
                tempArray.push(tempObj);

                $rootScope.ranges = tempArray;
                //console.log($rootScope.ranges);

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
                $rootScope.ranges = tempArray;
                //console.log($rootScope.ranges);
            } //End of else(allqs.length % interval)

            // Actually going to quize or study page
            if(way == "quizWay"){
                $state.go("quiz", {id: subId, subCatName: subTitle, setIdx: 0});
            }
            else{
                $state.go("study", {id: subId, subCatName: subTitle, setIdx: 0});
            }

            $ionicLoading.hide();

            },
            function(error){
                $ionicLoading.hide().then(function(){
                    ionicToast.show("Sorry something went wrong! Please try again.", 'top', false, 2000);
                });
            }); // End of allQtns.$loaded

    }
    
    // End initQuestionsSets


    
    // Goto quiz
    $scope.goToQuizOrStudy = function(subId, subTitle){

        // Hot search section
        // Increase counter value by 1 for using in Hot Topics
        var hotRef = firebase.database().ref().child("hotTopics/"+subId);
        var hotArray = $firebaseObject(hotRef);

        hotArray.$loaded().then(function(data){
            data.$value = data.$value + 1;
            data.$save();
        },function(error){
            console.log("Error while updating user info");
        });
         // End of Hot search section

        
        
        // goin to quiz or Study
        var history = $ionicHistory.viewHistory();

        if(history.backView.stateName == "quizWay"){
            // $state.go("quiz", {id: subId, subCatName: subTitle, startIdx: range.starting, endIdx: range.ending});
            $scope.initQuestionsSets("quizWay", subId, subTitle);
            
        }
        else{
            // $state.go("study", {id: subId, subCatName: subTitle, startIdx: range.starting, endIdx: range.ending});
            $scope.initQuestionsSets("studyWay", subId, subTitle);
            
        }
    }

    

}])