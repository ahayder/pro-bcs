angular.module('app.services', [])

.factory('ResultFacotry', [function(){
    var temp = [];

    return{
        saveResult: function(resultData){
            if(localStorage.getItem('results')==null){
				localStorage.setItem('results',[]);
			}
            if(localStorage.getItem('results').length>0){
				temp = JSON.parse(localStorage.getItem('results'));
				temp.push(resultData);
				localStorage.setItem('results',JSON.stringify(temp));
			}
			else{
				temp.push(resultData);
				localStorage.setItem('results',JSON.stringify(temp));
			}
        },
        getResult: function(){

		    temp = JSON.parse(localStorage.getItem('results'));

			return temp;
        }
    }
}])

.service('BlankService', [function(){

}]);