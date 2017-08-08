angular.module('budget.dashboard', [])
.controller('DashboardCtrl', function($scope, $ionicHistory, $state, $ionicPopup, marcadores, despesas, pagamentos, utils) {
	$ionicHistory.clearHistory();
	
	var dtHoje = new Date(),
		dtSemana = new Date(),
		ano = dtHoje.getFullYear(),
		mes = dtHoje.getMonth(),
		dia = 1,
		dtAnterior;
	
	dtSemana.setDate(dtSemana.getDate() + 7);
	
	$scope.dtFinalPagtos = dtSemana;

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
	
	$scope.marcadores = marcadores;
	$scope.despesas = despesas;
	$scope.pagamentos = pagamentos.filter({ vencimento: { $lte: dtSemana } });

	var results = despesas.filter({
		ano: { $gte: dtAnterior.getFullYear(), $lte: dtHoje.getFullYear() },
		mes: { $gte: dtAnterior.getMonth(), $lte: dtHoje.getMonth() }
	});

	var grouped = utils.reGroup(results, 'marcadores', 'marcadorId', 'valor')
		.groupBy([{ $sum: 'valor' }, { $sum: 'aggregated' }], ['ano', 'mes', 'marcadorId']);
	
	grouped.forEach(function(item) {
		var marcador = marcadores.get(item.marcadorId),
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

	$scope.mesAtual = grouped
		.query({ mes: dtHoje.getMonth() })
		.orderBy({ valor: 'desc' });

	$scope.mesAnterior = grouped
		.query({ mes: dtAnterior.getMonth() })
		.orderBy({ valor: 'desc' });

	$scope.pay = function(pagamento) {
		var confirmPopup = $ionicPopup.confirm({
				title: 'Efetuar Pagamento',
				okType: 'button-calm',
				okText: 'Sim',
				cancelText: 'Não',
				template: 'Deseja lançar este pagamento nas despesas?'
			}),
			item, index;
		
		confirmPopup.then(function(res) {
			if (res) {
				item = {
					ano: dtHoje.getFullYear(),
					mes: dtHoje.getMonth(),
					dia: dtHoje.getDate(),
					valor: pagamento.valor,
					marcadores: angular.copy(pagamento.marcadores)
				};
				
				$scope.despesas
					.save(item)
					.post().then();
				
				index = $scope.pagamentos.indexOfKey('id', pagamento.id);
				$scope.pagamentos.splice(index, 1);
			}
		});
	}
	
	$scope.goTo = function(marcadorId) {
		$state.go('app.despmarcador', { marcadorId: marcadorId });
	}
});