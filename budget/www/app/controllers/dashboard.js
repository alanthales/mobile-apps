angular.module('budget.dashboard', [])
.controller('DashboardCtrl', function($scope, daoFactory) {
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
    });
    
    $scope.getClass = function(item) {
        console.log('getClass');
        var resultado = $scope.mesAnterior.query({ marcadores: { $contain: item.marcadores } });
        if (!resultado.length) {
            return 'positive';
        }
        if (item.valor > resultado[0].valor) {
            return 'assertive';
        }
        if (item.valor < resultado[0].valor) {
            return 'balanced';
        }
        return ''
    }
});