angular.module('offersapp.home', [])
.controller('HomeCtrl', function($scope, $timeout, ionicMaterialInk, ionicMaterialMotion, DaoFact){
    this.ofertas = DaoFact.getOfertas();
    
//    this.gridLenght = { 'height': Math.ceil(this.ofertas.data.length / 4) * 150 + 'vw' };
        
    // Activate ink for controller
    ionicMaterialInk.displayEffect();
    
    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            selector: '.animate-fade-slide-in .item'
        });
    }, 300);
});