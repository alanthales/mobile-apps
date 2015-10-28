angular.module('controllers.estatisticas', ['ionic'])

.controller('EstatisticasCtrl', function($scope, $dao) {
    $scope.estat = {
        visitantes: 0.0,
        osmais: [],
        osmenos: []
    };
    
    $dao.getCelulas(function(results) {
        var celula = results[0] || {};
        if (!celula.membros) {
            celula.membros = [];
        }
        $scope.celula = celula;
    });
    
    $scope.contatos = $dao.getContatos();
    
    $dao.getChamadas(function(results) {
        $scope.estat.ofertas = results.reduce(function(p, c) {
            return p.oferta + c.oferta;
        });
        
        $scope.estat.visitantes = results.reduce(function(p, c) {
            return p.oferta + c.oferta;
        });
    });    
});
