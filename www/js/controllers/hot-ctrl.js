angular.module('app.hotController', [])
     
.controller('hotCtrl', ['$scope', '$rootScope', '$state', '$ionicLoading', 'Questions', '$stateParams', '$firebaseArray', 'ionicToast', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $rootScope, $state, $ionicLoading, Questions, $stateParams, $firebaseArray, ionicToast) {


    // Checking network connection
    if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
            firebase.database().goOffline();
            ionicToast.show("জনপপ্রিয় বিষয়সমূহ একটি অনলাইন ফিচার। বিষয়গুলো দেখতে ইন্টারনেট চালু করুন।", 'top', false, 3000);
        }
        else{
            firebase.database().goOnline();
            var subRef = firebase.database().ref().child("subCategories");
            var allSubs = $firebaseArray(subRef);

            var hot = firebase.database().ref().child("hotTopics");
            var query = hot.orderByValue();
            var allHots = $firebaseArray(query);

            $scope.hotTopics = [];


            allHots.$loaded().then(function(hots){
                    
                allSubs.$loaded().then(function(subs){
                    for(var i = 0; i < hots.length; i++){
                        for(var j = 0; j < subs.length; j++){
                            if(hots[i].$id == subs[j].$id){
                                $scope.hotTopics.push(subs[j]);
                            }
                        }
                    }
                },function(error){
                    ionicToast.show('দুঃখিত আবার চেষ্টা করুন।', 'middle', false, 2000);
                }); // end of all subs

                
            },function(error){
                ionicToast.show('দুঃখিত আবার চেষ্টা করুন।', 'middle', false, 2000);
            });// end of all hot
        }
    }// Checking network connection


    
    
    // Goto quiz
    $scope.goToQuiz = function(subId, subTitle){
        $ionicLoading.show({
            template: '<ion-spinner icon="spiral"></ion-spinner>'
        });

        var interval = parseInt($rootScope.quizQuestionsRange);
      
        
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
            ionicToast.show("দুঃখিত এই সাবক্যাটাগরিতে এখনও কোন প্রশ্ন যোগ করা হয়নি। আমরা প্রতিদিন ১০০ এর বেশী প্রশ্ন যোগ করে যাচ্ছি। প্রতিদিন অ্যাপ এর মেন্যুতে গিয়ে আপডেট করুন এবং নতুন প্রশ্ন পান।", 'middle', true, 3000);
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

        $state.go("quiz", {id: subId, subCatName: subTitle, setIdx: 0});


        $ionicLoading.hide();

    }// goto quiz
    
    
    



}]);