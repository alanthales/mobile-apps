angular.module('budget.dashboard', [])
.controller('DashboardCtrl', function($scope, daoFactory) {
    $scope.marcadores = daoFactory.getMarcadores();
    $scope.hoje = new Date();
    
    var dtini = (new Date($scope.hoje.getFullYear(), $scope.hoje.getMonth(), 1)).toISOString(),
        dtfin = (new Date($scope.hoje.getFullYear(), $scope.hoje.getMonth() + 1, 0)).toISOString();
    
    daoFactory.getDespesas(function(results) {
        $scope.atuais = results
            .query({ data: { $gte: dtini, $lte: dtfin } })
            .groupBy({ $sum: 'valor' }, ['marcadores'])
            .orderBy({ field: 'valor', order: 'desc' });
    });
});