angular.module('offersapp.category', [])
.controller('CategoryCtrl', function($scope, $stateParams, ionicMaterialMotion, DaoFact) {
    var categoriaId = $stateParams.id ? parseInt($stateParams.id) : 0;
    
    this.categoria = DaoFact.getCategorias().getById(categoriaId);
    
    this.ofertas = DaoFact.getOfertas().filter({ categoriaId: categoriaId });
});