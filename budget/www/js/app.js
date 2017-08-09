// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('budget', [
	'ionic', 'ionic-datepicker', 'ojs.directives', 'budget.directives', 'budget.syncSDB', 'budget.dao',
	'budget.bemvindo', 'budget.sidemenu', 'budget.dashboard', 'budget.marcadores', 'budget.despesas',
	'budget.despmarc', 'budget.config', 'budget.utils', 'budget.despdepend', 'budget.filters',
	'budget.pagamentos', 'budget.despmensal'
])

.run(function($ionicPlatform, $rootScope, $state, daoFactory, SyncSDB, utils) {
	var syncronizing = false,
		timer;
	
	$rootScope.listaMes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

	function syncData(callback) {
		var user = $rootScope.user,
			cb = callback && typeof callback === 'function' ? callback : function() {};

		if (!user || !user.registrado || syncronizing) {
			return;
		}
		
		console.log('syncronizing data...');

		syncronizing = true;

		SyncSDB.updateUser(function() {
			daoFactory.getMarcadores()
				.then(function(marcadores) {
					return marcadores.sync();
				})
				.then(function(arg) {
					return daoFactory.getDespesas();
				})
				.then(function(despesas) {
					return despesas.sync();
				})
				.then(function() {
					syncronizing = false;
					cb();
				})
				.catch(function(err) {
					console.error(JSON.stringify(err));
				});
		}, onDisconnect);
	};
	
	$rootScope.syncData = syncData;
	
	function onConnect() {
		var ms = 60*2*1000;
		timer = setInterval(syncData, ms);
		$rootScope.syncData();
	};
	
	function onDisconnect() {
		syncronizing = false;
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	};
	
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
		document.addEventListener('online', onConnect, false);
		document.addEventListener('offline', onDisconnect, false);
	});

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        var user = window.localStorage.getItem('usuario');

        if (toState.requireAuth && !user) {
            event.preventDefault();
            $state.transitionTo('bemvindo');
			return;
        }
        
		$rootScope.user = JSON.parse(user || '{}');
    });
})

.config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {
	$ionicConfigProvider.scrolling.jsScrolling(false);

	$stateProvider

	.state('bemvindo', {
		url: '/bemvindo',
		templateUrl: './app/views/bemvindo.html',
		controller: 'BemVindoCtrl'
	})

	.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: './app/templates/sidemenu.html',
		resolve: {
			marcadores: function(daoFactory) {
				return daoFactory.getMarcadores();
			}
		},
		controller: 'SideMenuCtrl'
	})

	.state('app.dashboard', {
		url: '/dashboard',
		views: {
			'menuContent': {
				templateUrl: './app/views/dashboard.html',
				controller: 'DashboardCtrl'
			}
		},
		resolve: {
			marcadores: function(daoFactory) {
				return daoFactory.getMarcadores();
			},
			despesas: function(daoFactory) {
				return daoFactory.getDespesas();
			},
			pagamentos: function(daoFactory) {
				return daoFactory.getPagamentos();
			}
		},
		requireAuth: true
	})

	.state('app.marcadores', {
		url: '/marcadores',
		views: {
			'menuContent': {
				templateUrl: './app/views/marcadores/lista.html',
				controller: 'MarcadoresCtrl'
			}
		},
		resolve: {
			marcadores: function(daoFactory) {
				return daoFactory.getMarcadores();
			}
		},
		requireAuth: true
	})

	.state('app.despesas', {
		url: '/despesas',
		views: {
			'menuContent': {
				templateUrl: './app/views/despesas/lista.html',
				controller: 'DespesasCtrl'
			}
		},
		resolve: {
			marcadores: function(daoFactory) {
				return daoFactory.getMarcadores();
			},
			despesas: function(daoFactory) {
				return daoFactory.getDespesas();
			}
		},
		requireAuth: true
	})

	.state('app.pagamentos', {
		url: '/pagamentos',
		views: {
			'menuContent': {
				templateUrl: './app/views/pagamentos/lista.html',
				controller: 'PagtosCtrl'
			}
		},
		resolve: {
			pagamentos: function(daoFactory) {
				return daoFactory.getPagamentos();
			}
		},
		requireAuth: true
	})
	
	.state('app.config', {
		url: '/config',
		views: {
			'menuContent': {
				templateUrl: './app/views/config.html',
				controller: 'ConfigCtrl as config'
			}
		},
		requireAuth: true
	})

	.state('app.despmarcador', {
		url: '/despmarcador/:marcadorId',
		views: {
			'menuContent': {
				templateUrl: './app/views/relatorios/marcador.html',
				controller: 'DespMarcadorCtrl'
			}
		},
		resolve: {
			marcadores: function(daoFactory) {
				return daoFactory.getMarcadores();
			},
			despesas: function(daoFactory) {
				return daoFactory.getDespesas();
			}
		},
		requireAuth: true
	})
	
	.state('app.despdependente', {
		url: '/despdependente/:dependenteId',
		views: {
			'menuContent': {
				templateUrl: './app/views/relatorios/dependente.html',
				controller: 'DespDependenteCtrl'
			}
		},
		resolve: {
			marcadores: function(daoFactory) {
				return daoFactory.getMarcadores();
			},
			despesas: function(daoFactory) {
				return daoFactory.getDespesas();
			}
		},
		requireAuth: true
	})

	.state('app.despmensal', {
		url: '/despmensal/:mes',
		views: {
			'menuContent': {
				templateUrl: './app/views/relatorios/mensal.html',
				controller: 'DespMensalCtrl'
			}
		},
		resolve: {
			marcadores: function(daoFactory) {
				return daoFactory.getMarcadores();
			},
			despesas: function(daoFactory) {
				return daoFactory.getDespesas();
			}
		},
		requireAuth: true
	});
	
	$urlRouterProvider.otherwise('/app/dashboard');
});