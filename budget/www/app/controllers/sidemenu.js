angular.module('budget.sidemenu', [])
.controller('SideMenuCtrl', function($scope, marcadores) {
    $scope.marcadores = marcadores;
    $scope.selections = [];
    
    $scope.openSub = function(key) {
        $scope.ahead = true;
        $scope.selections[$scope.selections.length] = key;
    }
    
    $scope.goBack = function() {
        $scope.selections.pop();
        $scope.ahead = false;
    }    
});