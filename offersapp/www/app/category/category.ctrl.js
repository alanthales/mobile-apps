angular.module('offersapp.category', [])
.controller('CategoryCtrl', function($scope, ionicMaterialMotion, ofertas) {
    this.categoria = ofertas.length ? ofertas[0].categoria : {};
    this.ofertas = ofertas;
});