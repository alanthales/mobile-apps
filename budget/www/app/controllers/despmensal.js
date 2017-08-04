angular.module('budget.despmensal', [])
.controller('DespMensalCtrl', function($scope, $stateParams, $rootScope, marcadores, despesas, utils) {
	$scope.mes = $rootScope.listaMes[parseInt($stateParams.mes)];
	$scope.marcadores = marcadores;

	// var results = despesas.filter({ mes: parseInt($stateParams.mes) });

	// $scope.despesas = utils.reGroup(results, 'marcadores', 'marcadorId', 'valor')
	// 	.groupBy([{ $sum: 'valor' }, { $sum: 'aggregated' }], ['ano', 'marcadorId']);

	// console.log($scope.despesas);
	$scope.despesas = despesas.data()
		.groupBy({ $sum: 'valor' }, ['ano', 'mes', 'marcadores'], { mes: parseInt($stateParams.mes) })
		.orderBy({ ano: 'desc', mes: 'desc', valor: 'desc' });
});