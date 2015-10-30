// Ionic Starter App
var db = new DbFactory('trilhoMDA', DbProxies.LOCALSTORAGE);

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('trilhoMDA', [
    'ionic', 'db.dao', 'ojs.directives', 'tabs.swipable', 'controllers.home', 'controllers.contatos',
    'controllers.celula', 'controllers.chamada', 'controllers.trilho', 'controllers.estatisticas'
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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.backButton.previousTitleText(false).text('').icon('ion-android-arrow-back');
    
    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'app/views/tabs.html',
        controller: 'AppCtrl'
    })

    .state('app.contatos', {
        url: '/contatos',
        views: {
            'tab-contatos': {
                templateUrl: 'app/views/contatos/lista.html',
                controller: 'ContatosCtrl'
            }
        }
    })
    
//    .state('app.contato', {
//        url: '/contato/:id',
//        views: {
//            'tab-contatos': {
//                templateUrl: 'app/views/contatos/detalhe.html',
//                controller: 'ContatoCtrl'
//            }
//        }
//    })
    
    .state('app.celula', {
        url: '/celula',
        views: {
            'tab-celula': {
                templateUrl: 'app/views/celulas/lista.html',
                controller: 'CelulaCtrl'
            }
        }
    })
    
    .state('app.estatisticas', {
        url: '/estatisticas/:celulaId',
        views: {
            'tab-celula': {
                templateUrl: 'app/views/celulas/estatisticas.html',
                controller: 'EstatisticasCtrl'
            }
        }
    })
    
    .state('app.chamadas', {
        url: '/chamadas',
        views: {
            'tab-chamada': {
                templateUrl: 'app/views/chamadas/lista.html',
                controller: 'ChamadaCtrl'
            }
        }
    })
    
    .state('app.trilhos', {
        url: '/trilhos',
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
