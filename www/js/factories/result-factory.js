angular.module('app.resultFactory', [])

.factory('ResultFacotry', ['$rootScope', function($rootScope){
    $rootScope.temp = [];

    return{
        saveResult: function(resultData){
            if(localStorage.getItem('results')==null){
				localStorage.setItem('results',[]);
			}
            if(localStorage.getItem('results').length>0){
				$rootScope.temp = JSON.parse(localStorage.getItem('results'));
				$rootScope.temp.push(resultData);
				localStorage.setItem('results',JSON.stringify($rootScope.temp));
			}
			else{
				$rootScope.temp.push(resultData);
				localStorage.setItem('results',JSON.stringify($rootScope.temp));
			}
        },
        getResult: function(){

		    temp = JSON.parse(localStorage.getItem('results'));

			return $rootScope.temp;
        }
    }
}]);

