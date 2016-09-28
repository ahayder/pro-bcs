angular.module('app.subController', [])

.controller('subCategoriesCtrl', ['$scope', 'ionicToast', 'UpdateFactory', 'Questions', 'SubCategories', '$stateParams', '$ionicLoading', '$firebaseObject', '$ionicHistory', '$state', '$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, ionicToast, UpdateFactory, Questions, SubCategories, $stateParams, $ionicLoading, $firebaseObject, $ionicHistory, $state, $rootScope) {

    $ionicLoading.show({
      template: '<ion-spinner icon="spiral"></ion-spinner>'
    });

    var allsubs = SubCategories.getAllSubCats();
    var tempSubs = [];

    for(var i = 0; i < allsubs.length; i++){
        if(allsubs[i].mainCatId == $stateParams.id){
            tempSubs.push(allsubs[i]);
        }
    }

    $scope.subs = tempSubs;
    $ionicLoading.hide();



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
        var allQuestions = Questions.getAllQuestions();
        
        // console.log(allQuestions);
        var tempQuestions = [];
        for(var i = 0; i < allQuestions.length; i++){
            if(allQuestions[i].subCatId == subId){
                tempQuestions.push(allQuestions[i]);
            }
        }
        var allqs = tempQuestions;
        if(allqs.length == 0){
            $ionicLoading.hide();
            ionicToast.show("দুঃখিত এই সাবক্যাটাগরিতে এখনও কোন প্রশ্ন যোগ করা হয়নি। আমরা প্রতিদিন ১০০ এর বেশী প্রশ্ন যোগ করে যাচ্ছি। প্রতিদিন অ্যাপ এর মেন্যুতে গিয়ে আপডেট করুন।", 'middle', false, 3500);
            return;
        }
        // console.log(allqs);

        // // All questions
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

    }// End initQuestionsSets


    
    // Goto quiz
    $scope.goToQuizOrStudy = function(subId, subTitle){

        // Checking network connection
        if(window.Connection) {
            if(navigator.connection.type == Connection.NONE) {
                firebase.database().goOffline();
                console.log("offline");
            }
            else{
                // Hot search section
                // Increase counter value by 1 for using in Hot Topics
                var hotRef = firebase.database().ref().child("hotTopics/"+subId);
                var hotArray = $firebaseObject(hotRef);

                hotArray.$loaded().then(function(data){
                    data.$value = data.$value + 1;
                    data.$save();
                },function(error){
                    console.log("Error while updating user info");
                });// End of Hot search section
            }
        }
        
        // goin to quiz or Study
        var history = $ionicHistory.viewHistory();

        if(history.backView.stateName == "quizWay"){
            $scope.initQuestionsSets("quizWay", subId, subTitle);
            
        }
        else{
            $scope.initQuestionsSets("studyWay", subId, subTitle);
            
        }
    }// Goto quiz



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
        ionicToast.show("দুঃখিত প্রশ্ন আপডেট হয়নি! আবার চেষ্টা করুন।", 'top', false, 1000);
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
        ionicToast.show("দুঃখিত সাবক্যাটাগরি আপডেট হয়নি! আবার চেষ্টা করুন।", 'top', false, 1000);
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
  $scope.updateApp = function(){
    $ionicLoading.show({
      template: '<ion-spinner icon="spiral"></ion-spinner><p>সার্ভার থেকে প্রশ্ন ডাউনলোড হচ্ছে। দয়া করে অপেক্ষা করুন।</p>'
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

}])