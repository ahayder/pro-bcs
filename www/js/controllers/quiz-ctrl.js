(function(){
  'use strict';

    angular.module('app.quizController', [])

    .controller('quizCtrl', quizCtrl);
    quizCtrl.$inject = ['$scope', '$cordovaNativeAudio', 'Questions','$stateParams', '$ionicPopup', 'ionicToast', '$state', '$timeout', '$rootScope', 'ResultFacotry', '$ionicLoading'];

    function quizCtrl($scope, $cordovaNativeAudio, Questions, $stateParams, $ionicPopup, ionicToast, $state, $timeout, $rootScope, ResultFacotry, $ionicLoading) {

        var vm = this;

        function play(audio) {
            try{
                $cordovaNativeAudio.play(audio);
            }
            catch(error){
                console.log(error.message);
            }
            
        };
        
        // This if for result Factory resetting result array

        if(localStorage.getItem('isQuizFirstTime') == 'true'){
            var setIndex = 0;
            ionicToast.show('এখানে সঠিক উত্তর নির্বাচন করুন', 'middle', false, 1500);
            localStorage.setItem('isQuizFirstTime', "false");
            
        }
        else{
            var setIndex = parseInt($stateParams.setIdx);
        }


        // question set settings
        // Making sets
        var sets = [];
        for(var i = 0; i < $rootScope.ranges.length; i++){
            var set = {};
            set.id = i; // It is for setting question set with range index inside $loaded
            set.starting = $rootScope.ranges[i].starting;
            set.ending = $rootScope.ranges[i].ending;
            var setNumber = i+1;
            set.value = "সেট "+ setNumber +"("+$rootScope.ranges[i].starting + "-" + $rootScope.ranges[i].ending+")";
            sets.push(set);
        }
        $rootScope.quizQuestionSets = sets;
        // End of Making sets

        
        vm.setShowing = {};
        vm.setShowing.selectedSet = sets[setIndex];


        vm.changeSet = function(value){
            $state.go("quiz", {id: $stateParams.id, subCatName: $stateParams.subName, setIdx: value.id});
        }

        // end of question set settings
        // end of question set settings













        // sound
        if($rootScope.sound){

            try{
                $cordovaNativeAudio
                    .preloadSimple('wrong', 'audio/wrong.mp3')
                    .then(function (msg) {
                        console.log(msg);
                    }, function (error) {
                        console.log(error);
                });
            }
            catch(error){
                console.log(error.message);
            }

            try{
                $cordovaNativeAudio
                    .preloadSimple('correct', 'audio/correct.mp3')
                    .then(function (msg) {
                    console.log(msg);
                    }, function (error) {
                        console.log(error);
                });
            }
            catch(error){
                console.log(error.message);
            }
            

                

        }

        vm.mute = function(){
            $rootScope.sound = !$rootScope.sound;
            if($rootScope.sound){
                ionicToast.show('সাউন্ড চালু হয়ছে', 'top', false, 1000);

                try{
                    $cordovaNativeAudio
                        .preloadSimple('wrong', 'audio/wrong.mp3')
                        .then(function (msg) {
                        console.log(msg);
                        }, function (error) {
                            console.log(error);
                    });
                }
                catch(error){
                    console.log(error.message);
                }

                try{
                    $cordovaNativeAudio
                        .preloadSimple('correct', 'audio/correct.mp3')
                        .then(function (msg) {
                        console.log(msg);
                        }, function (error) {
                            console.log(error);
                    });       

                }
                catch(error){
                    console.log(error.message);
                }

            
            }
            else{
                ionicToast.show('সাউন্ড বন্ধ হয়ছে', 'top', false, 1000);
            }
        }
        

        // end of sound


        $rootScope.temp = [];

        $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner>'
        });

        vm.subCatName = $stateParams.subCatName;
        // Score
        $rootScope.score = {}
        $rootScope.score.mark = 0;    

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
        } // Suffle function





        var rightAnswerWish = [
            "সাবাস বাঘের বাচ্চা!",
            "চমক চলতেই থাক!",
            "আরও হবে!",
            "আজকে ঠেকানোর কেউ নাই!",
            "এভাবেই চলছে চলবে!",
            "তালি হবে, তালি!",
            "দেখি আর কতো পারেন!",
            "ভাই চিকন পিন এর চার্জার আছে?",
            "হিরো আলম তো ফেইল!"
        ];

        var wrongAnswerWish = [
            "হুম মনযোগ এর অভাব...",
            "পরের টা কিন্তু ঠিক হবেই হবেই!",
            "ভুল? তো কি হইসে, শিখলম তো?",
            "ভুল? না..! সফলতার খুঁটি।",
            "খেলা চলবে, হার মানবো? না!",
            "ভুল যদি নাই হতো... তাহলে এতদিন এ...!",
            "পরের বার আয়, দেখবো!",
            "হাতিপুকে ডাকা লাগবে?",
            "ইচ্ছা.... ভুল করসি! প্রবলেম?"
        ];





        // arrray index number of the currently showing question
        vm.currentIndexNum = 0;


        // Question from index to index
        //console.log($rootScope.ranges);
        var start = parseInt($rootScope.ranges[setIndex].starting) -1;
        var end = parseInt($rootScope.ranges[setIndex].ending);



        // All questions
        var questions = Questions.getAllQuestions();
        // console.log(questions);
        var tempQuestions = [];
        for(var i = 0; i < questions.length; i++){
            if(questions[i].subCatId == $stateParams.id){
                tempQuestions.push(questions[i]);
            }
        }
        var allqs = tempQuestions; // // All questions


        // Doing Shuffle
        var rangedQtns = allqs.slice(start, end);

        // Total questions in this subcategory
        vm.totalQuestions = rangedQtns.length;
        //console.log(vm.totalQuestions)

        // Shuffling all questions
        vm.allQuestions = shuffle(rangedQtns);

        // Shuffling respective question's answers
        var tempOptionsArray = [
                                {title: vm.allQuestions[vm.currentIndexNum].option1, selected: false},
                                {title: vm.allQuestions[vm.currentIndexNum].option2, selected: false},
                                {title: vm.allQuestions[vm.currentIndexNum].option3, selected: false},
                                {title: vm.allQuestions[vm.currentIndexNum].answer, selected: false}
                                ];
        
        vm.options = shuffle(tempOptionsArray);

        $ionicLoading.hide(); // Doing Shuffle




        // Right or wrong answer
        vm.count = {
            right: 0,
            wrong: 0
        }


        


        // Checking answer    
        vm.checkAnswer = function(userAns){

            // saving into result
            var singleQuestion = {};
            singleQuestion.question = vm.allQuestions[vm.currentIndexNum];
            singleQuestion.userAnswer = userAns;
            ResultFacotry.saveResult(singleQuestion);  

            // If Right asnwer
            if(vm.allQuestions[vm.currentIndexNum].answer == userAns){
                if($rootScope.sound){
                    play("correct");
                }
                else{
                    console.log("Audio is muted");
                }
                
                $rootScope.score.mark += 1;
                var rwish = shuffle(rightAnswerWish);
                var rightAnsAlert = $ionicPopup.show({
                        title: '<h3 class="title light">'+rwish[0]+'</h3>',
                        cssClass: 'right-answer',
                        template: '<h5 class="title light" style="text-align:center;">উত্তর সঠিক</h5>'
                    });
                
                $timeout(function() {
                    rightAnsAlert.close(); //close the popup after specified seconds for some reason
                }, 1000);

                vm.count.right++;

                // checking whether no more questions available
                if(vm.allQuestions.length == vm.currentIndexNum+1){

                    $timeout(function() {
                        //ionicToast.show("You've completed all the questions in this category", 'top', false, 2000);
                        $state.go("result", {subId: $stateParams.id, subCatName: vm.subCatName, setIdx: setIndex});
                    }, 1000);
                    

                    return;
                }

                $timeout(function() {
                    vm.currentIndexNum++;
                    // Shuffling next question's answers
                    var tempOptionsArray = [
                                    {title: vm.allQuestions[vm.currentIndexNum].option1, selected: false},
                                    {title: vm.allQuestions[vm.currentIndexNum].option2, selected: false},
                                    {title: vm.allQuestions[vm.currentIndexNum].option3, selected: false},
                                    {title: vm.allQuestions[vm.currentIndexNum].answer, selected: false}
                                    ];
            
                    vm.options = shuffle(tempOptionsArray);
                }, 1000);
                
                

                
            }
            // If Wrong Answer
            else{
                if($rootScope.sound){
                    play("wrong");
                }
                else{
                    console.log("Audio is muted");
                }

                $rootScope.score.mark = $rootScope.score.mark <= 0 ? 0 : $rootScope.score.mark-0.50;
                //console.log("ভুল! সঠিক উত্তরঃ " + vm.allQuestions[vm.currentIndexNum].answer);

                //ionicToast.show("Wrong! Right answer is " + vm.allQuestions[vm.currentIndexNum].answer, 'bottom', false, 2250);
                var wwish = shuffle(wrongAnswerWish);
                var wrongAnsAlert = $ionicPopup.show({
                        title: '<h3 class="title light">'+ wwish[0] +'</h3>',
                        cssClass: 'wrong-answer',
                        template: '<h5 class="title light" style="text-align:center;">'+'সঠিক উত্তরঃ ' + vm.allQuestions[vm.currentIndexNum].answer+'</h5>'
                    });
                
                $timeout(function() {
                    wrongAnsAlert.close(); //close the popup after specified seconds for some reason
                }, 2650);


                vm.count.wrong++;
                // checking whether no more questions available
                if(vm.allQuestions.length == vm.currentIndexNum+1){

                    $timeout(function() {
                        //ionicToast.show("You've completed all the questions in this category", 'top', false, 2000);
                        $state.go("result", {subId: $stateParams.id, subCatName: vm.subCatName, setIdx: setIndex});
                    }, 1000);
                    
                    return;
                }

                $timeout(function() {
                    vm.currentIndexNum++;
                    // Shuffling next question's answers
                    var tempOptionsArray = [
                                    {title: vm.allQuestions[vm.currentIndexNum].option1, selected: false},
                                    {title: vm.allQuestions[vm.currentIndexNum].option2, selected: false},
                                    {title: vm.allQuestions[vm.currentIndexNum].option3, selected: false},
                                    {title: vm.allQuestions[vm.currentIndexNum].answer, selected: false}
                                    ];
            
                    vm.options = shuffle(tempOptionsArray);
                }, 2250);
                

                
            }

            
        } // End of check answer function

        if($rootScope.sound){
            $scope.$on("$ionicView.beforeLeave", function(event, data){
                
                try{
                    $cordovaNativeAudio.unload('correct');
                }
                catch(error){
                    console.log(error.message);
                }

                try{
                    $cordovaNativeAudio.unload('wrong');
                }
                catch(error){
                    console.log(error.message);
                }
                

                
            });
        }

        // report question
        vm.reportQuestion = function(id){
            var confirmPopup = $ionicPopup.confirm({
                title: 'অনুমোদন',
                template: 'অভিযোগ টি পাঠান'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    // Checking network connection
                    if(window.Connection) {
                        if(navigator.connection.type == Connection.NONE) {
                            firebase.database().goOffline();
                            ionicToast.show("এটি একটি অনলাইন ফিচার। ইন্টারনেট একটিভেট করে চেষ্টা করুন।", 'top', false, 3000);
                        }
                        else{
                            firebase.database().goOnline();
                            var hotRef = firebase.database().ref().child("reportedQuestions");
                            hotRef.child(id).set("reported");
                            ionicToast.show("আপনার অভিযোগটি রাখা হয়েছে। ধন্যবাদ আপনার সহযোগিতার জন্য। শীঘ্রই আমরা আপানর অভিযোগ ভুলটি সংশোধন করে ফেলবো।", 'top', false, 3500);
                        }
                    }// Checking network connection
                } else {
                    return;
                }
            });
            
        }



        


    }

})();