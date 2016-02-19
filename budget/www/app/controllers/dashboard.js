angular.module('budget.dashboard', [])
.controller('DashboardCtrl', function($scope, daoFactory) {
    $scope.hoje = new Date();
    $scope.hoje = new Date();

    $scope.marcadores = daoFactory.getMarcadores();
    
    daoFactory.getDespesas(function(results) {
        $scope.mesAtual = results
            .query({ ano: $scope.hoje.getFullYear(), mes: $scope.hoje.getMonth() })
            .groupBy({ $sum: 'valor' }, ['ano', 'mes', 'marcadores'])
            .orderBy({ ano: 'desc', mes: 'desc', valor: 'desc' });
        
        $scope.mesAnterior = results
            .query({ ano: $scope.hoje.getFullYear(), mes: $scope.hoje.getMonth() })
            .groupBy({ $sum: 'valor' }, ['ano', 'mes', 'marcadores'])
            .orderBy({ ano: 'desc', mes: 'desc', valor: 'desc' });
    });
});