angular.module('offersapp.home', [])
.controller('HomeCtrl', function($scope, $timeout, DaoFact){
    this.ofertas = DaoFact.getOfertas();

    this.loadMore = function() {
//        this.ofertas.next();
    };
    
    $timeout(function() {
        document.getElementsByClassName('button-fab-top-right')[0].classList.toggle('on');
    }, 300);
});