angular.module('controllers.chamada', ['ionic'])

.controller('ChamadaCtrl', function($scope, $dao) {
    $scope.celula = undefined;
    $scope.chamadas = $dao.getChamadas();
    $scope.contatos = $dao.getContatos();
    
    $dao.getCelulas(function(results) {
        $scope.celula = results[0];
    });
});