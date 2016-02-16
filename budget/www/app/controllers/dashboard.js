angular.module('budget.dashboard', [])
.controller('DashboardCtrl', function($scope, daoFactory) {
    $scope.marcadores = daoFactory.getMarcadores();
    
    daoFactory.getDespesas(function(results) {
        $scope.atuais = results.query({ data: { $gte: new Date(2016, 1, 1), $lte: new Date(2016, 1, 29) } }).groupBy({ $sum: 'valor' }, ['data']);
        console.log($scope.atuais);
    });
});