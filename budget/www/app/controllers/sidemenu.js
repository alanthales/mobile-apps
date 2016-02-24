angular.module('budget.sidemenu', [])
.controller('SideMenuCtrl', function($scope, daoFactory) {
    $scope.marcadores = daoFactory.getMarcadores();
});