// Ionic Starter App
var _user = window.localStorage.getItem('usuario');

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('budget', [
    'ionic', 'ionic-datepicker', 'ojs.directives', 'budget.directives', 'budget.syncSDB', 'budget.dao',
    'budget.bemvindo', 'budget.sidemenu', 'budget.dashboard', 'budget.marcadores', 'budget.despesas',
    'budget.despmarc'
])

.run(function($ionicPlatform, $rootScope, $interval, daoFactory) {
    var timer;
    
    $rootScope.user = _user ? JSON.parse( _user ) : {};
    $rootScope.listaMes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    $rootScope.hasConnection = function() {
        if (!navigator.connection) {
            return false;
        }
        
        var states = {}

        states[Connection.WIFI] = 'Wifi connection';
        states[Connection.CELL_3G] = '3G connection';
        states[Connection.CELL_4G] = '4G connection';

        return navigator.connection.type in states;
    };
    
    function syncData() {
        if ($rootScope.user.registrado) {
            daoFactory.getMarcadores().sync();
            daoFactory.getDespesas().sync();
        }
    };
    
    function onConnect() {
        timer = $interval(syncData, 60*5*1000);
    };
    
    function onDisconnect() {
        if (timer) {
            $interval.cancel(timer);
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
        if ($rootScope.hasConnection) {
            onConnect();
        }
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
    });

    if (_user) {
        $urlRouterProvider.otherwise('/app/dashboard');
    } else {
        $urlRouterProvider.otherwise('/');
    }
});
