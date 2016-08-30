angular.module('app.resultController', [])

.controller('resultCtrl', ['$scope', '$state', '$rootScope', 'ResultFacotry', '$stateParams', '$ionicModal', '$firebaseAuth', 'Auth', 'ionicToast', '$firebaseArray', '$firebaseObject', 'ngFB', '$ionicHistory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $rootScope, ResultFacotry, $stateParams, $ionicModal, $firebaseAuth, Auth, ionicToast, $firebaseArray, $firebaseObject, ngFB, $ionicHistory) {

    


    $scope.page = {}
    $scope.page.title = $stateParams.subCatName;

    // for result calculation
    var marks = {};
    marks.correct = 0;
    marks.wrong = 0;
    
    var temp = ResultFacotry.getResult();

    $scope.lbButtonDisable = false;
    

    // Setting the backgroud color classs based on answer correctness
    for(var i = 0; i < temp.length; i++){
        if(temp[i].question.answer == temp[i].userAnswer){
            temp[i].bgColor = "bg-green";
            marks.correct += 1;
        }
        else{
            temp[i].bgColor = "bg-red";
            marks.wrong += 1;
        }
    }

    $scope.results = temp;


    // Calculation of result
    
    marks.total = temp.length;
    marks.correctPercentage = marks.correct *  100 / marks.total;
    marks.wrongPercentage = marks.wrong *  100 / marks.total;
    marks.score = marks.correct - (marks.wrong * 0.50);



    $scope.marks = marks;

    $scope.$on('$ionicView.beforeLeave', function() {
        //do stuff before enter
        // Initializing the localstorage result variable as empty
        ResultFacotry.emptyTemp();
    });



    // share modal modal
    $ionicModal.fromTemplateUrl('templates/modals/joinnlb-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });



     // Login page modal
    $ionicModal.fromTemplateUrl('templates/modals/login-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.loginModal = modal;
    });




    // Join NLB
    $scope.joinNLB = function(){

        if ($rootScope.user) {
            // User is signed in.
            // Share score into leaderboard

                
                $scope.modal.show();


        } else { 
            
                $scope.loginModal.show();

        }

    }



    





    // FB Login
    $scope.fbLogin = function(){
        // $scope.loginModal.hide();
        // var myconfig = {};
        // myconfig.fbClientId = "1746998085570124";
        // Auth.loginWithFacebook(myconfig).then(function(suc){
            
        //     ionicToast.show("Successfully signed in with Facebook", 'top', false, 2000);
        //     $scope.modal.show();
        // },
        // function(err){
        //     $scope.loginModal.hide();
        //     ionicToast.show("Something went wrong, please try agin", 'top', false, 2000);
        // });

        ngFB.login({ scope: 'email' }).then(
        function (response) {
            if (response.status === 'connected') {
                $scope.loginModal.hide();
                console.log('Facebook login succeeded', response)
                ionicToast.show("Successfully signed in with Facebook", 'top', false, 2000);
                $scope.modal.show();
 
                var credential = firebase.auth.FacebookAuthProvider.credential(
                    response.authResponse.accessToken);
 
                firebase.auth().signInWithCredential(credential).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // ...
                });
 
            } else {
                ionicToast.show("Facebook Login Failed try Google login. Best of luck!", 'top', false, 2000);
            }
        },function(error){
            ionicToast.show("Facebook Login Failed try Google login. Best of luck!", 'top', false, 2000);
        });
    }

    // Google login
    $scope.googleLogin = function(){
        $scope.loginModal.hide();
        var myconfig = {};
        myconfig.googleClientId = "251798023266-t2t4rp4jn5sn9l61q3kg7u5qd0rqtod8.apps.googleusercontent.com";
        Auth.loginWithGoogle(myconfig).then(function(suc){
            
            ionicToast.show("Successfully signed in with Google", 'top', false, 2000);
            $scope.modal.show();
        },
        function(err){

            ionicToast.show("Google Login Failed try Facebook login. Best of luck!", 'top', false, 2000);
        });
    }


    /// Login ended




    // Leader board score Share

    $scope.goToLeaderboard = function(){

        
        var leaderRef = firebase.database().ref().child("leaderboard/"+$rootScope.user.uid);
        var leadersRef = firebase.database().ref().child("leaderboard");


            var leader = $firebaseArray(leaderRef);


            leader.$loaded().then(
                function(ref){
                    if(ref.length == 0){
                        var score = $scope.marks.score.toFixed(2);
                        var correctness = $scope.marks.correctPercentage.toFixed(2);

                        leadersRef.child($rootScope.user.uid).set({

                            name: $rootScope.user.displayName,
                            email: $rootScope.user.email,
                            score: score,
                            correctness: correctness,
                            photoURL: $rootScope.user.photoURL

                        }).then(function(response){
                            $scope.modal.hide();
                            $scope.lbButtonDisable = true;
                            ionicToast.show('Welcome to our national leaderboard. See your position inside Leaderboard page', 'middle', true, 5000);
                        },function(error){
                            $scope.modal.hide();
                            ionicToast.show('Something went wrong, try again', 'middle', false, 1000);
                        });

                    }  // End of if
                    else{
                        var oldCorrectness = parseInt(ref[0].$value);
                        var oldScore = parseInt(ref[3].$value);

                        var newCorrectness = (oldCorrectness + $scope.marks.correctPercentage)/2;
                        var newScore = oldScore + parseInt($scope.marks.score);

                        console.log(newCorrectness);
                        console.log(newScore);

                        var obj = $firebaseObject(leaderRef);
                        obj.$remove().then(function(result){
                            console.log("Deleted");
                            leadersRef.child($rootScope.user.uid).set({

                                    name: $rootScope.user.displayName,
                                    email: $rootScope.user.email,
                                    score: newScore.toFixed(2),
                                    correctness: newCorrectness.toFixed(2),
                                    photoURL: $rootScope.user.photoURL

                                }).then(function(response){
                                    console.log("Newly Added from update func");
                                    $scope.modal.hide();
                                    $scope.lbButtonDisable = true;
                                    ionicToast.show("Your information updated", 'middle', false, 2000);
                                },function(error){
                                    $scope.modal.hide();
                                    ionicToast.show('Something went wrong, try again', 'middle', false, 1000);
                                });
                        },
                        function(error){
                            $scope.modal.hide();
                            ionicToast.show('Something went wrong, try again', 'middle', false, 1000);
                        });
                    } // End of else
                }, // End ot ref function
                function(error){
                    $scope.modal.hide();
                    ionicToast.show('Something went wrong, try again', 'middle', false, 2000);
                }// End of error funciton
            ); // End of then

        

    } /// End of go to leaderboard funciton


    $scope.backToQuiz = function(){
        $ionicHistory.goBack(-2);    
    }

}])