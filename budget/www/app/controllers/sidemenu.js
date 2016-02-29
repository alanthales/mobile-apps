angular.module('budget.sidemenu', [])
.controller('SideMenuCtrl', function($scope, daoFactory) {
    $scope.marcadores = daoFactory.getMarcadores();
    $scope.selections = [];
    
    $scope.openSub = function(evt, key) {
        $scope.selections[$scope.selections.length] = {
            key: key, 
            title: evt.currentTarget.getElementsByClassName('title')[0].textContent
        };
    }
    $scope.backToBefore = function() {
        $scope.selections.pop();
        $scope.submenu = $scope.selections.length > 1;
    }    
});