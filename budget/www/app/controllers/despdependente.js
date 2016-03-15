angular.module('budget.despdepend', [])
.controller('DespDependenteCtrl', function($scope, $stateParams, daoFactory, $rootScope) {    
    var despDependent = [];
    
    $scope.marcadores = daoFactory.getMarcadores();
    
    $scope.dependente =
        $rootScope.user.grupo.find(function(depend){
            return depend.email == $stateParams.dependenteId
        }).nome;

    daoFactory.getDespesas(function(results) {
        despDependent = results.query({ usuario: $stateParams.dependenteId });
        
        $scope.mesesDesp = despDependent        
            .groupBy({ $sum: 'valor', alias: 'total' }, ['ano', 'mes'])
            .orderBy({ ano: 'desc', mes: 'desc' });
    });
    
    $scope.getDespesas = function(year, month) {
        return despDependent
            .query({ ano: year, mes: month })
            .groupBy({ $sum: 'valor' }, ['marcadores'])
            .orderBy({ valor: 'desc' });        
    }
});