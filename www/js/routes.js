angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  .state('bcsQuiz.categories', {
    url: '/categories',
    views: {
      'tab1': {
        templateUrl: 'templates/categories.html',
        controller: 'categoriesCtrl'
      }
    }
  })

  .state('bcsQuiz.hot', {
    url: '/hot',
    views: {
      'tab2': {
        templateUrl: 'templates/hot.html',
        controller: 'hotCtrl'
      }
    }
  })



  // .state('bcsQuiz.tags', {
  //   url: '/tags',
  //   views: {
  //     'tab3': {
  //       templateUrl: 'templates/tags.html',
  //       controller: 'tagsCtrl'
  //     }
  //   }
  // })

  .state('bcsQuiz', {
    url: '/tabs',
    templateUrl: 'templates/bcsQuiz.html',
    abstract:true
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('bcsQuiz.subCategories', {
    url: '/subCategories/:id',
    views: {
      'tab1': {
        templateUrl: 'templates/subCategories.html',
        controller: 'subCategoriesCtrl'
      }
    }
  })

  .state('bcsQuiz.quizConfig', {
    url: '/quizConfig/:id/:subName',
    cache: false,
    views: {
      'tab1': {
        templateUrl: 'templates/quiz-config.html',
        controller: 'quizConfigCtrl'
      }
    }
  })

  .state('bcsQuiz.quiz', {
    url: '/quiz/:id/:subCatName/:startIdx/:endIdx',  
    cache: false,
    onEnter: function(){
      localStorage.setItem('results',[]);
      console.log("emptied");
    },
    views: {
      'tab1': {
        templateUrl: 'templates/quiz.html',
        controller: 'quizCtrl'
      }
    }
  })

  .state('bcsQuiz.study', {
    url: '/study/:id/:subCatName/:startIdx/:endIdx',  
    cache: false,
    views: {
      'tab1': {
        templateUrl: 'templates/study.html',
        controller: 'studyCtrl'
      }
    }
  })

  .state('bcsQuiz.result', {
    url: '/result/:subCatName',
    cache: false,
    views: {
      'tab1': {
        templateUrl: 'templates/result.html',
        controller: 'resultCtrl'
      }
    }
  })

  .state('leaderboard', {
    url: '/leaderboard',
    cache: false,
    templateUrl: 'templates/leaderboard.html',
    controller: 'leaderboardCtrl'
  })

$urlRouterProvider.otherwise('tabs/categories')

  

});