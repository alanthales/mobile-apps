angular.module('budget.despmensal', [])
.controller('DespMensalCtrl', function($scope, $stateParams, $rootScope, daoFactory, utils) {
    $scope.marcadores = daoFactory.getMarcadores();
    
    $scope.mes = $rootScope.listaMes[$stateParams.mes];

    daoFactory.getDB().query('despesas', { mes: $stateParams.mes }, function(results) {
        var despesas = utils.reGroup(results, 'marcadores', 'marcadorId', 'valor');
            
        $scope.despesas = despesas
            .groupBy([{ $sum: 'valor' }, { $sum: 'aggregated' }], ['ano', 'marcadorId']);
    });
});