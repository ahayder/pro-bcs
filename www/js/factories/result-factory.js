angular.module('app.resultFactory', [])

.factory('ResultFacotry', ['$rootScope', function($rootScope){
    $rootScope.temp = [];

    return{
        saveResult: function(resultData){
            if(localStorage.getItem('results')==null){
				localStorage.setItem('results',[]);
				//console.log("First if working")
			}
            if(localStorage.getItem('results').length>0){
				$rootScope.temp = JSON.parse(localStorage.getItem('results'));
				$rootScope.temp.push(resultData);
				localStorage.setItem('results',JSON.stringify($rootScope.temp));
				//console.log("Second if working")
			}
			else{
				$rootScope.temp.push(resultData);
				localStorage.setItem('results',JSON.stringify($rootScope.temp));
				//console.log("Else if working")
			}
        },
        getResult: function(){

		    temp = JSON.parse(localStorage.getItem('results'));

			return $rootScope.temp;
        }
    }
}]);

