angular.module('budget.dashboard', [])
.controller('DashboardCtrl', function($scope, $ionicHistory, $state, $ionicPopup, daoFactory, utils) {
    $ionicHistory.clearHistory();
    
    var dtHoje = new Date(),
        dtSemana = new Date(),
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
        var despesas = utils.reGroup(results, 'marcadores', 'marcadorId', 'valor');
//            i, obj;

//        results.forEach(function(item) {
//            for (i = 0; i < item.marcadores.length; i++) {
//                obj = angular.copy(item);
//                delete obj.marcadores;
//                obj.marcadorId = item.marcadores[i];
//                obj.total = i === 0 ? obj.valor : 0;
//                despesas.put(obj);
//            }
//        });

        despesas = despesas
            .groupBy([{ $sum: 'valor' }, { $sum: 'aggregated' }], ['ano', 'mes', 'marcadorId']);

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

    dtSemana.setDate(dtSemana.getDate() + 7);
    
    $scope.dtFinalPagtos = dtSemana;
    
    daoFactory.getDB()
        .query('pagamentos', { vencimento: { $lte: dtSemana } }, function(results) {
            $scope.pagamentos = results;
        });
    
    $scope.pay = function(pagamento) {
        var confirmPopup = $ionicPopup.confirm({
                title: 'Confirme',
                okType: 'button-calm',
                okText: 'Sim',
                cancelText: 'Não',
                template: 'Deseja lançar este pagamento nas despesas?'
            }),
            despesas = daoFactory.getDespesas(),
            item, index;
        
        confirmPopup.then(function(res) {
            if (res) {
                item = {
                    ano: dtHoje.getFullYear(),
                    mes: dtHoje.getMonth(),
                    dia: dtHoje.getDate(),
                    valor: pagamento.valor,
                    marcadores: pagamento.marcadores
                };
                
                despesas.insert(item);
                despesas.post();
                
                index = $scope.pagamentos.indexOfKey('id', pagamento.id);
                $scope.pagamentos.splice(index, 1);
            }
        });
    }
    
    $scope.goTo = function(marcadorId) {
        $state.go('app.despmarcador', { marcadorId: marcadorId });
    }
});