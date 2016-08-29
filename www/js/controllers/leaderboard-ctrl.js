angular.module('app.leaderboardController', [])

.controller('leaderboardCtrl', ['$scope', '$rootScope', '$firebaseArray', 'ionicToast', '$ionicLoading', '$firebaseObject', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $rootScope, $firebaseArray, ionicToast, $ionicLoading, $firebaseObject) {


    $ionicLoading.show({
      template: '<ion-spinner icon="spiral"></ion-spinner>'
    });

    var leadersRef = firebase.database().ref().child("leaderboard");
    var allleaders = $firebaseArray(leadersRef);


    // Fucntion for getting the array postion
    function arrayObjectIndexOf(myArray, searchTerm, property) {
        for(var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchTerm) return i;
        }
        return -1;
    }


    // Var for logged in enrolled user information
    $scope.your = {};


    

    allleaders.$loaded().then(function(result){
        $scope.allleaders = result;
        $scope.totalLeaders = result.length;
        console.log($scope.allleaders);
        $ionicLoading.hide();

        if($rootScope.user == null){ // if user is not logged in
            $scope.loginState = false;
            //console.log("true");
        }else{ // if logged in
            $scope.loginState = true;
            var leaderRef = firebase.database().ref().child("leaderboard/"+$rootScope.user.uid);
            // console.log(leaderRef);
            var leader = $firebaseObject(leaderRef);
            
            leader.$loaded().then(function(data){
                console.log(data);

                if(data.$value !== null){ // if user is enrolled in leader board
                    console.log("true");
                    $scope.enrolled = true;
                    $scope.notEnrolled = false;

                    // Getting user position
                    var allLeaders = result;
                    allLeaders.sort(function(a, b){
                        var aScore = parseInt(a.score);
                        var bScore = parseInt(b.score);
                        return bScore - aScore;
                    });

                    console.log($rootScope.user.displayName);
                    var position = arrayObjectIndexOf(allLeaders, $rootScope.user.uid, "$id"); // 1
                    $scope.your.position = position+1;
                    $scope.your.score = allLeaders[position].score;
                    $scope.your.correctness = allLeaders[position].correctness;
                    // End of getting postion
                    
                    
                }else{ // if user is not enrolled in leader baord
                    console.log("false");
                    $scope.enrolled = false;
                    $scope.notEnrolled = true;

                } // End of if user is not enrolled in leader baord
            },function(error){
                ionicToast.show('Something went wrong, try again', 'middle', false, 2000);
            });
        } // end of if logged in
    },function(error){
        ionicToast.show('Something went wrong, try again', 'middle', false, 2000);
        $ionicLoading.hide();
    });    



}])