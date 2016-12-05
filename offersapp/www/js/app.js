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
	'BACKEND': 'http://' + (location.hostname === 'localhost' ? 'localhost:1337' : 'offersapp.herokuapp.com'),
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
			StatusBar.styleLightContent();
			StatusBar.overlaysWebView(false);
			StatusBar.backgroundColorByHexString('#ffc900');
			ionic.Platform.fullScreen(true, true);
		}
	});

	$rootScope.getImage = function(oferta) {
		return oferta.imagem ? urls.IMAGES + '/' + oferta.imagem : 'img/noimage.jpg';
	};
	
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		var city = UserStore.getStore().cidade;

		if (toState.requireCity && !city) {
			event.preventDefault();
			$state.transitionTo('bemvindo');
		}
		
		return;
	});

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        event.preventDefault();
		$state.transitionTo('error');
    });
})

.config(function($compileProvider, $ionicConfigProvider, $stateProvider, $urlRouterProvider) {
	$compileProvider.debugInfoEnabled(location.hostname === 'localhost');
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

	.state('error', {
		url: '/error',
		templateUrl: './app/states/error.html'
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
		cache: false,
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
		},
		requireCity: true
	})

	.state('app.search', {
		url: '/search',
		views: {
			'pageContent': {
				templateUrl: './app/search/search.html',
				controller: 'SearchCtrl as ctrl'
			}
		},
		requireCity: true
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
			categoria: function(DaoFact, $stateParams) {
				return DaoFact.getCategorias().then(function(results) {
					var index = results.indexOfKey('id', parseInt($stateParams.id));
					return results[index];
				});
			},
			ofertas: function(DaoFact, $stateParams) {
				return DaoFact.getOfertas({ categoria: $stateParams.id });
			}
		},
		requireCity: true
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
		},
		requireCity: true
	})

	.state('app.my-list', {
		cache: false,
		url: '/my-list',
		views: {
			'pageContent': {
				templateUrl: './app/my-list/my-list.html',
				controller: 'MyListCtrl as ctrl'
			}
		},
		requireCity: true
	})// Yeoman hook. States section. Do not remove this comment.
	;

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/');
});