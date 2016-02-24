angular.module('budget.despmarc', [])
.controller('DespMarcadorCtrl', function($scope, $stateParams, daoFactory) {
    daoFactory.getMarcadores(function(results) {
        var index = results.indexOfKey('id', parseInt($stateParams.marcadorId));
        $scope.marcador = results[index].descricao;
    });
    
    daoFactory.getDespesas(function(results) {
        $scope.despesas = results
            .query({ marcadores: { $contain: $stateParams.marcadorId } })
            .groupBy({ $sum: 'valor' }, ['ano', 'mes', 'dia'])
            .orderBy({ ano: 'desc', mes: 'desc', dia: 'asc' });
    });
    
    $scope.getDate = function(item) {
        return new Date(item.ano, item.mes, item.dia);
    }
});