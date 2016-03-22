angular.module('budget.despdepend', [])
.controller('DespDependenteCtrl', function($scope, $stateParams, daoFactory, $rootScope) {    
    var limit = 12,
        despDependent = [];
            
    $scope.limitData = limit;
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
        
        $scope.despesas = despDependent
            .groupBy({ $sum: 'valor' }, ['ano', 'mes', 'marcadores'])
            .orderBy({ valor: 'desc' });
    });
    
    $scope.loadMore = function() {
        $scope.limitData += limit;
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };    
});