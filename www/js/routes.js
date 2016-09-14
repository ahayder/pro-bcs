angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  .state('quizWay', {
    url: '/quizWay',
    cache: false,
    templateUrl: 'templates/categories.html',
    controller: 'categoriesCtrl'
  })


  .state('studyWay', {
    url: '/studyWay',
    templateUrl: 'templates/categories.html',
    controller: 'categoriesCtrl'
  })


  .state('hot', {
    url: '/hot',
    cache: false,
    templateUrl: 'templates/hot.html',
    controller: 'hotCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })



  .state('subCategories', {
    url: '/subCategories/:id',
    cache: false,
    templateUrl: 'templates/subCategories.html',
    controller: 'subCategoriesCtrl'
  })

  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html',
    controller: 'settingsCtrl'
  })

  .state('quiz', {
    url: '/quiz/:id/:subCatName/:setIdx',  
    cache: false,
    onEnter: function(){
      localStorage.setItem('results',[]);
      //console.log("emptied from enter");
    },
    templateUrl: 'templates/quiz.html',
    controller: 'quizCtrl'
  })

  .state('study', {
    url: '/study/:id/:subCatName/:setIdx',  
    cache: false,
    templateUrl: 'templates/study.html',
    controller: 'studyCtrl'
  })

  .state('result', {
    url: '/result/:subId/:subCatName/:setIdx',
    cache: false,
    onExit: function(){
      localStorage.setItem('results',[]);
      console.log("emptied from exit");
    },
    templateUrl: 'templates/result.html',
    controller: 'resultCtrl'
  })

  .state('leaderboard', {
    url: '/leaderboard',
    cache: false,
    templateUrl: 'templates/leaderboard.html',
    controller: 'leaderboardCtrl'
  })

  .state('feedback', {
    url: '/feedback',
    cache: false,
    templateUrl: 'templates/feedback.html',
    controller: 'feedbackCtrl'
  });

  $urlRouterProvider.otherwise('quizWay');

  

});