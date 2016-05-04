angular.module('budget.despdepend', [])
.controller('DespDependenteCtrl', function($scope, $stateParams, daoFactory, $rootScope) {    
    $scope.marcadores = daoFactory.getMarcadores();
    
    console.log($stateParams.dependenteId);
    
    $scope.dependente =
        $rootScope.user.grupo.filter(function(depend){
            return depend.id == $stateParams.dependenteId
        })[0];

    daoFactory.getDespesas(function(results) {
        $scope.despesas = results
            .groupBy({ $sum: 'valor' }, ['ano', 'mes', 'marcadores'], { usuario: $stateParams.dependenteId })
            .orderBy({ ano: 'desc', mes: 'desc', valor: 'desc' });
    });
});