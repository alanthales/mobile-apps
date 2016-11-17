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
	'offersapp.my-list',
	'offersapp.bemvindo',
	'offersapp.userstore'// Yeoman hook. Define section. Do not remove this comment.
])

.constant('urls', {
    'BACKEND': 'http://' + (location.hostname === "localhost" ? 'localhost:1337' : 'offersapp.herokuapp.com'),
    'IMAGES': 'https://s3.amazonaws.com/offersapp'
})

.run(function($ionicPlatform, $rootScope, $state, urls, UserStore) {
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
    
    $rootScope.getImage = function(oferta) {
        return oferta.imagem ? urls.IMAGES + '/' + oferta.imagem : 'img/noimage.jpg';
    };

    if (UserStore.getStore().cidade) {
        $state.transitionTo('app.home');
    } else {
        $state.transitionTo('bemvindo');
    }
})

.config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {
  $ionicConfigProvider.scrolling.jsScrolling(false);

  $stateProvider

  .state('bemvindo', {
    url: '/bemvindo',
    templateUrl: './app/bemvindo/bemvindo.html',
    controller: 'BemvindoCtrl as ctrl',
    resolve: {
        cidades: function(DaoFact) {
            return DaoFact.getCidades();
        }
    }
  })

  .state('app', {
      abstract: true,
      templateUrl: './app/sidemenu/sidemenu.html',
      resolve: {
          categorias: function(DaoFact) {
              return DaoFact.getCategorias();
          },
          lista: function(DaoFact) {
              return DaoFact.getLista();
          }
      },
      controller: 'SideMenuCtrl as ctrl'
  })
  
  .state('app.home', {
    url: '/',
    views: {
        'pageContent': {
            templateUrl: './app/home/home.html',
            controller: 'HomeCtrl as ctrl'
        }
    },
    resolve: {
        ofertas: function(DaoFact) {
            return DaoFact.getOfertas();
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
    },
    resolve: {
        ofertas: function(DaoFact, $stateParams) {
            return DaoFact.getOfertas({ categoria: $stateParams.id });
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
    },
    resolve: {
        oferta: function(DaoFact, $stateParams) {
            return DaoFact.getOferta($stateParams.id).then(function(result) {
                return result.length ? result[0] : {};
            });
        },
        lista: function(DaoFact) {
            return DaoFact.getLista();
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
  $urlRouterProvider.otherwise('/notfound');
});
