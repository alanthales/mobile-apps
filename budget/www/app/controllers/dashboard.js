angular.module('budget.dashboard', [])
.controller('DashboardCtrl', function($scope, daoFactory) {
    $scope.marcadores = daoFactory.getMarcadores();
    
//    daoFactory.getDB().sum('despesas', { sum: ['valor'], group: ['marcador'] }, { valor: { $gt: 0 } }, function(results) {
//        
//    });
    
    daoFactory.getDB().select('despesas', { }, function(results) {
        var grouped = [],
            marcadores = [],
            l = results.length,
            i = 0;
        
        for (; i < l; i++) {
            
        }
    });
});