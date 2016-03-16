angular.module('budget.despdepend', [])
.controller('DespDependenteCtrl', function($scope, $stateParams, daoFactory, $rootScope) {    
    var despDependent = [], desps = {};

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
        var key = ''+year+month;
        
        if (desps[key])
            return desps[key];
        
        desps[key] = despDependent
            .query({ ano: year, mes: month })
            .groupBy({ $sum: 'valor' }, ['marcadores'])
            .orderBy({ valor: 'desc' });
        
        return desps[key];
    }
});