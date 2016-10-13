angular.module('offersapp.home', [])
.controller('HomeCtrl', function($scope, $timeout, DaoFact){
    this.ofertas = DaoFact.getOfertas();
    
    $timeout(function() {
        document.getElementsByClassName('button-fab-top-right')[0].classList.toggle('on');
    }, 300);
    
//    this.gridLenght = { 'height': Math.ceil(this.ofertas.data.length / 4) * 150 + 'vw' };
});