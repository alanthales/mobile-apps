// Ionic Starter App
var db = new DbFactory('trilhoMDA', DbProxies.LOCALSTORAGE);

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('trilhoMDA', [
    'ionic', 'db.dao', 'ojs.directives', 'tabs.swipable', 'controllers.home', 'controllers.contato',
    'controllers.celula', 'controllers.chamada', 'controllers.trilho'
])

.run(function($ionicPlatform) {
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
        
//        db.initializeDb([
//            {
//                table: "contatos",
//                fields: [
//                    { name: "id", type: "int", nullable: false, primary: true },
//                    { name: "nome", type: "varchar", nullable: false },
//                    { name: "telefone", type: "varchar" }
//                ]
//            }
//        ]);
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'app/tabs.html',
        controller: 'AppCtrl'
    })

    .state('app.contatos', {
        url: '/contatos',
        views: {
            'tab-contatos': {
                templateUrl: 'app/views/contatos/lista.html',
                controller: 'ContatoCtrl'
            }
        }
    })
    
    .state('app.celula', {
        url: '/celula',
        views: {
            'tab-celula': {
                templateUrl: 'app/views/celulas/lista.html',
                controller: 'CelulaCtrl'
            }
        }
    })
    
    .state('app.chamada', {
        url: '/chamada',
        views: {
            'tab-chamada': {
                templateUrl: 'app/views/chamadas/lista.html',
                controller: 'ChamadaCtrl'
            }
        }
    })
    
    .state('app.trilho', {
        url: '/trilho',
        views: {
            'tab-trilho': {
                templateUrl: 'app/views/trilhos/lista.html',
                controller: 'TrilhoCtrl'
            }
        }
    });
    
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/contatos');
});
