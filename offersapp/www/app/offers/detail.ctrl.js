angular.module('offersapp.offersdetail', [])
.controller('OffersDetailCtrl', function($scope, $stateParams, DaoFact, ionicMaterialInk, ionicMaterialMotion) {
    var ofertaId = $stateParams.id ? parseInt($stateParams.id) : 0;
    
    this.oferta = DaoFact.getOfertas().getById(ofertaId);
    
    ionicMaterialMotion.slideUp({ selector: '.slide-up' });
    
    ionicMaterialMotion.fadeSlideInRight();
    
    ionicMaterialInk.displayEffect();
});