(function(){
  'use strict';

    angular.module('app.studyController', [])
    .controller('studyCtrl', studyCtrl);
    
    studyCtrl.$inject = ['$scope', '$ionicPlatform', 'Questions', '$stateParams', '$ionicPopup', 'ionicToast', '$state', '$rootScope', '$ionicLoading'];
    function studyCtrl($scope, $ionicPlatform, Questions, $stateParams, $ionicPopup, ionicToast, $state, $rootScope, $ionicLoading) {

        var vm = this;

        $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner>'
        });

        // Sate Params /quiz/:id/:subCatName/:qType/:startIdx/:endIdx
        vm.subCatName = $stateParams.subName;


        // Score
        $rootScope.score = {}
        $rootScope.score.mark = 0;

        

        // Suffle function
        function shuffle(array) {
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
        vm.studyQuestionSets = sets;
        // End of Making sets

        var setIndex = parseInt($stateParams.setIdx);
        vm.setShowing = {};
        vm.setShowing.selectedSet = sets[setIndex];
        
        vm.fixSet = function(){
            $state.go("study", {id: $stateParams.id, subCatName: $stateParams.subName, setIdx: vm.setShowing.selectedSet.id});
        }

        // end of question set settings
        // end of question set settings




        // arrray index number of the currently showing question
        vm.currentIndexNum = 0;


        // Question from index to index
        var start = parseInt($rootScope.ranges[setIndex].starting) -1;
        var end = parseInt($rootScope.ranges[setIndex].ending);

        // All questions
        var questions = Questions.getAllQuestions();
        var tempQuestions = [];
        for(var i = 0; i < questions.length; i++){
            if(questions[i].subCatId == $stateParams.id){
                tempQuestions.push(questions[i]);
            }
        }
        var allqs = tempQuestions; // // All questions

        var rangedQtns = allqs.slice(start, end);

        // Total questions in this subcategory
        vm.totalQuestions = rangedQtns.length;

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

        $ionicLoading.hide();




    // next-------------------------
        vm.next = function(){

            if(vm.allQuestions.length == (vm.currentIndexNum + 1) ){
                ionicToast.show('এই সেট এর প্রশ্ন শেষ। পরবর্তী সেট এর প্রশ্নের উপর স্টাডি করতে "প্রশ্ন বদলান" থেকে নতুন সেট সিলেক্ট করুন।', 'middle', true, 3500);
            }
            else{
                vm.currentIndexNum++;

                // Shuffling next question's answers
                    var tempOptionsArray = [
                                    {title: vm.allQuestions[vm.currentIndexNum].option1, selected: false},
                                    {title: vm.allQuestions[vm.currentIndexNum].option2, selected: false},
                                    {title: vm.allQuestions[vm.currentIndexNum].option3, selected: false},
                                    {title: vm.allQuestions[vm.currentIndexNum].answer, selected: false}
                                    ];
            
                vm.options = shuffle(tempOptionsArray);
            }
            
        }


        vm.previous = function(){

            if(vm.currentIndexNum == 0){
                ionicToast.show('এই সেট এর প্রশ্ন শেষ। পরবর্তী সেট এর প্রশ্নের উপর স্টাডি করতে "প্রশ্ন বদলান" থেকে নতুন সেট সিলেক্ট করুন।', 'middle', true, 3500);
            }
            else{
                vm.currentIndexNum--;
                    // Shuffling next question's answers
                    var tempOptionsArray = [
                                    {title: vm.allQuestions[vm.currentIndexNum].option1, selected: false},
                                    {title: vm.allQuestions[vm.currentIndexNum].option2, selected: false},
                                    {title: vm.allQuestions[vm.currentIndexNum].option3, selected: false},
                                    {title: vm.allQuestions[vm.currentIndexNum].answer, selected: false}
                                    ];
            
                vm.options = shuffle(tempOptionsArray);
            }
            
        }





        vm.showAnswer = function(options){

            for(var i = 0 ; i < options.length; i++){
                if(vm.allQuestions[vm.currentIndexNum].answer == options[i].title){
                    vm.rightAnswer = options[i].title;
                }
            }

        }


        $ionicPlatform.onHardwareBackButton(function() {
            // Admob code
                // preppare and load ad resource in background, e.g. at begining of game level
                var inter_key = "ca-app-pub-9736917302037050/7106879122";
                if(AdMob) AdMob.prepareInterstitial( {adId: inter_key, autoShow:true, isTesting:false} );
                // show the interstitial later, e.g. at end of game level
                if(AdMob) AdMob.showInterstitial();
            // End of Admob code
        });
            


    }

})();