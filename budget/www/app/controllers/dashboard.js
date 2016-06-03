angular.module('budget.dashboard', [])
.controller('DashboardCtrl', function($scope, daoFactory, $ionicHistory, $state) {
    $ionicHistory.clearHistory();
    
    var dtHoje = new Date(),
        ano = dtHoje.getFullYear(),
        mes = dtHoje.getMonth(),
        dia = 1,
        dtAnterior;
    
    if (mes === 0) {
        mes = 11;
        ano--;
    } else {
        mes--;
    }
    
//    if ([0,2,4,6,7,9,11].indexOf(mes) >= 0) {
//        dia = 31;
//    } else if (mes === 1) {
//        dia = ano % 4 == 0 ? 29 : 28;
//    }
    
    dtAnterior = new Date(ano, mes, dia);
    
    $scope.marcadores = daoFactory.getMarcadores();
    
    var onGetResult = function(results) {
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

        despesas = despesas
            .groupBy([{ $sum: 'valor' }, { $sum: 'total' }], ['ano', 'mes', 'marcadorId']);

        despesas.forEach(function(item) {
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

        $scope.mesAtual = despesas
            .query({ mes: dtHoje.getMonth() })
            .orderBy({ valor: 'desc' });

        $scope.mesAnterior = despesas
            .query({ mes: dtAnterior.getMonth() })
            .orderBy({ valor: 'desc' });
    };
    
    daoFactory.getDB().query('despesas',
        {
            ano: { $gte: dtAnterior.getFullYear(), $lte: dtHoje.getFullYear() },
            mes: { $gte: dtAnterior.getMonth(), $lte: dtHoje.getMonth() }
        }, onGetResult);
    
//    daoFactory.getDespesas(function(results) {
//        var despAgrup = new ArrayMap(),
//            despesas, i, obj;
//        
//        despesas = results.query({
//            ano: { $gte: dtAnterior.getFullYear(), $lte: dtHoje.getFullYear() },
//            mes: { $gte: dtAnterior.getMonth(), $lte: dtHoje.getMonth() }
//        });
//        
//        despesas.forEach(function(item) {
//            for (i = 0; i < item.marcadores.length; i++) {
//                obj = angular.copy(item);
//                delete obj.marcadores;
//                obj.marcadorId = item.marcadores[i];
//                obj.total = i === 0 ? obj.valor : 0;
//                despAgrup.put(obj);
//            }
//        });
//        
//        despAgrup = despAgrup
//            .groupBy([{ $sum: 'valor' }, { $sum: 'total' }], ['ano', 'mes', 'marcadorId']);
//        
//        despAgrup.forEach(function(item) {
//            var marcador = $scope.marcadores.getById(item.marcadorId),
//                limite = marcador.limite || 0,
//                diff;
//            
//            if (limite === 0) return;
//            
//            if (item.valor >= limite) {
//                item.class = 'assertive';
//            } else {
//                diff = item.valor * 100 / limite;
//                item.class = diff > 70 ? 'energized' : '';
//            }
//        });
//        
//        $scope.mesAtual = despAgrup
//            .query({ mes: dtHoje.getMonth() })
//            .orderBy({ valor: 'desc' });
//
//        $scope.mesAnterior = despAgrup
//            .query({ mes: dtAnterior.getMonth() })
//            .orderBy({ valor: 'desc' });
//    });
    
    $scope.goTo = function(marcadorId) {
        $state.go('app.despmarcador', { marcadorId: marcadorId });
    }
});