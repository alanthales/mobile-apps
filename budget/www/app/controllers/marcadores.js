angular.module('budget.marcadores', [])
.controller('MarcadoresCtrl', function($scope, $dao) {
    $scope.marcadores = $dao.getMarcadores();
});