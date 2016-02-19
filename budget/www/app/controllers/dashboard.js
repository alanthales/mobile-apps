angular.module('budget.dashboard', [])
.controller('DashboardCtrl', function($scope, daoFactory) {
    $scope.hoje = new Date();

    $scope.marcadores = daoFactory.getMarcadores();
    
    daoFactory.getDespesas(function(results) {
        $scope.totalMes = results
            .query({ ano: { $lte: $scope.hoje.getFullYear() }, mes: { $lte: $scope.hoje.getMonth() } })
            .groupBy({ $sum: 'valor' }, ['ano', 'mes', 'marcadores'])
            .orderBy({ ano: 'desc', mes: 'desc', valor: 'desc' });
    });
    
    $scope.saveIndex = function(index) {
        $scope.myIndex = index;
    };
});