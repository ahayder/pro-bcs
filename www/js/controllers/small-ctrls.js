angular.module('app.controllers', [])
     
.controller('hotCtrl', ['$scope', '$stateParams', '$firebaseArray', 'ionicToast', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray, ionicToast) {
    
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
            ionicToast.show("Sorry something went wrong! Please try again.", 'top', false, 2000);
        }); // end of all subs

        
    },function(error){
        ionicToast.show("Sorry something went wrong! Please try again.", 'top', false, 2000);
    });// end of all hot
    



}])
   
.controller('categoriesCtrl', ['$scope', '$stateParams', '$firebaseArray', '$ionicLoading', 'ionicToast', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray, $ionicLoading, ionicToast) {

    $ionicLoading.show({
      template: '<ion-spinner icon="spiral"></ion-spinner>'
    });

    var catRef = firebase.database().ref().child("categories");

    $scope.cats = $firebaseArray(catRef);

    $scope.cats.$loaded().then(function(ref){
        $ionicLoading.hide();
    },function(error){
        $ionicLoading.hide().then(function(){
            ionicToast.show("Sorry something went wrong! Please try again.", 'top', false, 2000);
            console.log("The loading indicator is now hidden");
        });
    });

}])
   
.controller('subCategoriesCtrl', ['$scope', '$stateParams', '$firebaseArray', '$ionicLoading', '$firebaseObject',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray, $ionicLoading, $firebaseObject) {

    $ionicLoading.show({
      template: '<ion-spinner icon="spiral"></ion-spinner>'
    });
    
    var subCatRef = firebase.database().ref().child("subCategories");

    var query = subCatRef.orderByChild("mainCatId").equalTo($stateParams.id);

    $scope.subs = $firebaseArray(query);

    $scope.subs.$loaded().then(function(ref){
        $ionicLoading.hide();
    },function(error){
        $ionicLoading.hide().then(function(){
            ionicToast.show("Sorry something went wrong! Please try again.", 'top', false, 2000);
            console.log("The loading indicator is now hidden");
        });
    });

    // Hot search section
    
    
    $scope.forHotTopics = function(id){
        console.log(id);
        var hotRef = firebase.database().ref().child("hotTopics/"+id);
        var hotArray = $firebaseObject(hotRef);

        hotArray.$loaded().then(function(data){
            data.$value = data.$value + 1;
            data.$save();
        },function(error){
            console.log("Error while updating user info");
        });
    }

    

}])


// .controller('tagsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// // You can include any angular dependencies as parameters for this function
// // TIP: Access Route Parameters for your page via $stateParams.parameterName
// function ($scope, $stateParams) {


// }])



   
.controller('aboutUsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
 