angular.module('budget.dashboard', [])
.controller('DashboardCtrl', function($scope, daoFactory, $ionicHistory, $state) {
    $ionicHistory.clearHistory();
    $scope.dtHoje = new Date();
    
    var ano = $scope.dtHoje.getFullYear(),
        mes = $scope.dtHoje.getMonth(),
        dia = 31;
    
    if ([0,2,4,6,7,9,11].indexOf(mes) == -1) {
        dia = 30;
    } else if (mes === 1) {
        dia = ano % 4 == 0 ? 29 : 28;
    }
    
    if (mes === 0) {
        mes = 11;
        ano--;
    } else {
        mes--;
    }
    
    $scope.dtAnterior = new Date(ano, mes, dia);
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