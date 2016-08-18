angular.module('app.resultController', [])

.controller('resultCtrl', ['$scope', '$state', '$rootScope', 'ResultFacotry', '$stateParams',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $rootScope, ResultFacotry, $stateParams) {
    $scope.page = {}
    $scope.page.title = $stateParams.subCatName;

    // for result calculation
    var marks = {};
    marks.correct = 0;
    marks.wrong = 0;
    
    var temp = ResultFacotry.getResult();
    

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
    marks.score = marks.correct - (marks.wrong * 1.25);



    $scope.marks = marks;
    



}])