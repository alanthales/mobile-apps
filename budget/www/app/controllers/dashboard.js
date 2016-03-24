angular.module('budget.dashboard', [])
.controller('DashboardCtrl', function($scope, daoFactory, $ionicHistory, $state) {
    $ionicHistory.clearHistory();
    
    $scope.dtHoje = new Date();
    $scope.dtAnterior = new Date();
    
    $scope.dtAnterior.setMonth($scope.dtHoje.getMonth() - 1);
    
    $scope.marcadores = daoFactory.getMarcadores();
    
    daoFactory.getDespesas(function(results) {
        $scope.mesAtual = results
            .query({ ano: $scope.dtHoje.getFullYear(), mes: $scope.dtHoje.getMonth() })
            .groupBy({ $sum: 'valor' }, ['ano', 'mes', 'marcadores'])
            .orderBy({ valor: 'desc' });
        
        $scope.mesAnterior = results
            .query({ ano: $scope.dtAnterior.getFullYear(), mes: $scope.dtAnterior.getMonth() })
            .groupBy({ $sum: 'valor' }, ['ano', 'mes', 'marcadores'])
            .orderBy({ valor: 'desc' });
        
        $scope.mesAtual.forEach(function(item) {
            var resultado = $scope.mesAnterior.query({ marcadores: { $contain: item.marcadores } });
            if (!resultado.length) {
                item.class = 'positive';
                item.icon = 'ion-plus-round';
            } else if (item.valor > resultado[0].valor) {
                item.class = 'assertive';
                item.icon = 'ion-arrow-up-b';
            } else if (item.valor < resultado[0].valor) {
                item.class = 'balanced';
                item.icon = 'ion-arrow-down-b';
            } else {
                item.class = 'bold';
                item.icon = 'ion-equal';
            }
        });
    });
    
    $scope.goTo = function(marcadorId) {
        $state.go('app.despmarcador', { marcadorId: marcadorId });
    }
});