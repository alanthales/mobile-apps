angular.module('budget.despdepend', [])
.controller('DespDependenteCtrl', function($scope, $stateParams, $rootScope, marcadores, despesas) {
	$scope.marcadores = marcadores;
	
	$scope.dependente =
		$rootScope.user.grupo.filter(function(depend){
			return depend.id == $stateParams.dependenteId
		})[0];

	$scope.despesas = despesas.data()
		.groupBy({ $sum: 'valor' }, ['ano', 'mes', 'marcadores'], { usuario: $stateParams.dependenteId })
		.orderBy({ ano: 'desc', mes: 'desc', valor: 'desc' });
});