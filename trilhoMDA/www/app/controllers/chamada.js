angular.module('controllers.chamada', ['ionic'])

.controller('ChamadaCtrl', function($scope) {
    $scope.chamadas = db.createDataSet('chamadas');
    
    $scope.chamadas.open();
});