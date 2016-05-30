angular.module('budget.dashboard', [])
.controller('DashboardCtrl', function($scope, daoFactory, $ionicHistory, $state) {
    $ionicHistory.clearHistory();
    $scope.dtHoje = new Date();
    
    var ano = $scope.dtHoje.getFullYear(),
        mes = $scope.dtHoje.getMonth(),
        dia = 30;
    
    if (mes === 0) {
        mes = 11;
        ano--;
    } else {
        mes--;
    }
    
    if ([0,2,4,6,7,9,11].indexOf(mes) >= 0) {
        dia = 31;
    } else if (mes === 1) {
        dia = ano % 4 == 0 ? 29 : 28;
    }
    
    $scope.dtAnterior = new Date(ano, mes, dia);
    $scope.marcadores = daoFactory.getMarcadores();
    
    daoFactory.getDespesas(function(results) {
        var despesas = new ArrayMap(),
            i, obj;
        
        results.forEach(function(item) {
            for (i = 0; i < item.marcadores.length; i++) {
                obj = angular.copy(item);
                delete obj.marcadores;
                obj.marcadorId = item.marcadores[i];
                obj.total = i === 0 ? obj.valor : 0;
                despesas.put(obj);
            }
        });
        
        $scope.mesAtual = despesas
            .query({ ano: $scope.dtHoje.getFullYear(), mes: $scope.dtHoje.getMonth() })
            .groupBy([{ $sum: 'valor' }, { $sum: 'total' }], ['ano', 'mes', 'marcadorId'])
            .orderBy({ valor: 'desc' });

        $scope.mesAtual.forEach(function(item) {
            var marcador = $scope.marcadores.getById(item.marcadorId),
                limite = marcador.limite || 0,
                diff;
            
            if (limite === 0) return;
            
            if (item.valor >= limite) {
                item.class = 'assertive';
            } else {
                diff = item.valor * 100 / limite;
                item.class = diff > 70 ? 'energized' : '';
            }
        });
        
        $scope.mesAnterior = despesas
            .query({ ano: $scope.dtAnterior.getFullYear(), mes: $scope.dtAnterior.getMonth() })
            .groupBy([{ $sum: 'valor' }, { $sum: 'total' }], ['ano', 'mes', 'marcadorId'])
            .orderBy({ valor: 'desc' });
        
//        $scope.mesAtual = results
//            .query({ ano: $scope.dtHoje.getFullYear(), mes: $scope.dtHoje.getMonth() })
//            .groupBy({ $sum: 'valor' }, ['ano', 'mes', 'marcadores'])
//            .orderBy({ valor: 'desc' });
//        
//        $scope.mesAnterior = results
//            .query({ ano: $scope.dtAnterior.getFullYear(), mes: $scope.dtAnterior.getMonth() })
//            .groupBy({ $sum: 'valor' }, ['ano', 'mes', 'marcadores'])
//            .orderBy({ valor: 'desc' });
//        
//        $scope.mesAtual.forEach(function(item) {
//            var resultado = $scope.mesAnterior.query({ marcadores: { $contain: item.marcadores } });
//            if (!resultado.length) {
//                item.class = 'positive';
//                item.icon = 'ion-plus-round';
//            } else if (item.valor > resultado[0].valor) {
//                item.class = 'assertive';
//                item.icon = 'ion-arrow-up-b';
//            } else if (item.valor < resultado[0].valor) {
//                item.class = 'balanced';
//                item.icon = 'ion-arrow-down-b';
//            } else {
//                item.class = 'bold';
//                item.icon = 'ion-equal';
//            }
//        });
    });
    
    $scope.goTo = function(marcadorId) {
        $state.go('app.despmarcador', { marcadorId: marcadorId });
    }
});