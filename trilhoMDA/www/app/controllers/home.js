angular.module('controllers.home', ['ionic'])

.controller('AppCtrl', function($scope, $rootScope) {
    $scope.$on('$stateChangeSuccess', function(event, toState) {
        switch(toState.name) {
            case 'app.contato':
            case 'app.contatos':
                $scope.tabColor = 'assertive';
                break;
            case 'app.celula':
            case 'app.estatisticas':
                $scope.tabColor = 'positive';
                break;
            case 'app.chamada':
            case 'app.chamadas':
                $scope.tabColor = 'balanced';
                break;
            default:
                $scope.tabColor = 'energized';
        }
    });
});