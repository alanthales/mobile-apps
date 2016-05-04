// Ionic Starter App
var _user = window.localStorage.getItem('usuario');

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('budget', [
    'ionic', 'ionic-datepicker', 'ojs.directives', 'budget.directives', 'budget.syncSDB', 'budget.dao',
    'budget.bemvindo', 'budget.sidemenu', 'budget.dashboard', 'budget.marcadores', 'budget.despesas',
    'budget.despmarc', 'budget.config', 'budget.utils', 'budget.despdepend', 'budget.filters'
])

.run(function($ionicPlatform, $rootScope, daoFactory, SyncSDB) {
    var timer;
    
    $rootScope.user = _user ? JSON.parse( _user ) : {};
    $rootScope.listaMes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    function syncData(callback) {
        if (!$rootScope.user.registrado) {
            return;
        }
        console.log('syncronizing data...');
        SyncSDB.updateUser(function() {
            daoFactory.getMarcadores().sync();
            daoFactory.getDespesas().sync();
            if (typeof callback === 'function') {
                callback();
            }
        }, onDisconnect);
    };
    
    $rootScope.syncData = syncData;
    
    function onConnect() {
        var ms = 60*2.5*1000;
        timer = setInterval(syncData, ms);
    };
    
    function onDisconnect() {
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
//        $rootScope.syncData();
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: './app/templates/sidemenu.html',
        controller: 'SideMenuCtrl'
    })

    .state('bemvindo', {
        url: '/',
        templateUrl: './app/views/bemvindo.html',
        controller: 'BemVindoCtrl'
    })

    .state('app.dashboard', {
        url: '/dashboard',
        views: {
            'menuContent': {
                templateUrl: './app/views/dashboard.html',
                controller: 'DashboardCtrl'
            }
        }
    })

    .state('app.marcadores', {
        url: '/marcadores',
        views: {
            'menuContent': {
                templateUrl: './app/views/marcadores/lista.html',
                controller: 'MarcadoresCtrl'
            }
        }
    })

    .state('app.despesas', {
        url: '/despesas',
        views: {
            'menuContent': {
                templateUrl: './app/views/despesas/lista.html',
                controller: 'DespesasCtrl'
            }
        }
    })

    .state('app.despmarcador', {
        url: '/despmarcador/:marcadorId',
        views: {
            'menuContent': {
                templateUrl: './app/views/despesas/marcador.html',
                controller: 'DespMarcadorCtrl'
            }
        }
    })
    
    .state('app.config', {
        url: '/config',
        views: {
            'menuContent': {
                templateUrl: './app/views/config.html',
                controller: 'ConfigCtrl as config'
            }
        }
    })
    
    .state('app.despdependente', {
        url: '/despdependente/:dependenteId',
        views: {
            'menuContent': {
                templateUrl: './app/views/despesas/dependente.html',
                controller: 'DespDependenteCtrl'
            }
        }
    });    

    if (_user) {
        $urlRouterProvider.otherwise('/app/dashboard');
    } else {
        $urlRouterProvider.otherwise('/');
    }
});