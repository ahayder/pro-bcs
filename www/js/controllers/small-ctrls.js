angular.module('app.controllers', [])
     
.controller('hotCtrl', ['$scope', '$stateParams', '$firebaseArray',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray) {

    var subCatRef = firebase.database().ref().child("subCategories");
    var query = subCatRef.orderByChild("count").limitToFirst(5);
    $scope.allHots = $firebaseArray(query);



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
   
.controller('subCategoriesCtrl', ['$scope', '$stateParams', '$firebaseArray', '$ionicLoading',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray, $ionicLoading) {

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
    var hotRef = firebase.database().ref().child("hotSearches");
    var hotArray = $firebaseArray(hotRef);

    

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
 