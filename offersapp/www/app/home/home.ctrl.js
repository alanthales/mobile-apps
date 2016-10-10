angular.module('offersapp.home', [])
.controller('HomeCtrl', function($scope, $timeout, ionicMaterialInk, ionicMaterialMotion, DaoFact){
    this.ofertas = DaoFact.getOfertas();
    
    // Activate ink for controller
    ionicMaterialInk.displayEffect();
    
    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            selector: '.animate-fade-slide-in .item'
        });
    }, 300);
});