angular.module('budget.sidemenu', [])
.controller('SideMenuCtrl', function($scope, daoFactory) {
    $scope.marcadores = daoFactory.getMarcadores();
    $scope.selections = [];
    
    $scope.openSub = function(evt, key) {
        $scope.selections[$scope.selections.length] = {
            key: key, 
            title: 'Voltar'
        };
    }
    
    $scope.backToBefore = function() {
        $scope.selections.pop();
    }    
});