angular.module('controllers.home', ['ionic'])
.controller('HomeCtrl', function($scope, $rootScope) {
    $scope.menu = [
        { a: { title: "Igreja", icon: "ion-home", class: "igreja" }, b: { title: "Aconteceu", icon: "ion-speakerphone", class: "aconteceu" } },
        { a: { title: "Bíblia", icon: "ion-document-text", class: "biblia" }, b: { title: "Pregações", icon: "ion-mic-b", class: "pregacoes" } },
        { a: { title: "Vídeos", icon: "ion-ios-videocam", class: "videos" }, b: { title: "Eventos", icon: "ion-star", class: "eventos" } }
    ]
});
