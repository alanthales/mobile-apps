// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('offersapp', [
    'ionic',
    'ionic-material',
    'offersapp.home',
	'offersapp.search',
	'offersapp.dao',
	'offersapp.category',
	'offersapp.offers',
	'offersapp.popup',
	'offersapp.offersdetail',
	'offersapp.my-list'// Yeoman hook. Define section. Do not remove this comment.
])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('app', {
      abstract: true,
      templateUrl: './app/sidemenu/sidemenu.html',
      controller: 'SideMenuCtrl as ctrl'
  })
  
  .state('app.home', {
    url: '/',
    views: {
        'pageContent': {
            templateUrl: './app/home/home.html',
            controller: 'HomeCtrl as ctrl'
        }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'pageContent': {
        templateUrl: './app/search/search.html',
        controller: 'SearchCtrl as ctrl'
      }
    }
  })

  .state('app.category', {
    url: '/category/:id',
    views: {
      'pageContent': {
        templateUrl: './app/category/category.html',
        controller: 'CategoryCtrl as ctrl'
      }
    }
  })

  .state('app.offersdetail', {
    url: '/offersdetail/:id',
    views: {
      'pageContent': {
        templateUrl: './app/offers/detail.html',
        controller: 'OffersDetailCtrl as ctrl'
      }
    }
  })

  .state('app.my-list', {
    url: '/my-list',
    views: {
      'pageContent': {
        templateUrl: './app/my-list/my-list.html',
        controller: 'MyListCtrl as ctrl'
      }
    }
  })// Yeoman hook. States section. Do not remove this comment.
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
});
