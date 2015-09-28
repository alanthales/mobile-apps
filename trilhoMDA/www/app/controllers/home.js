angular.module('controllers.home', ['ionic'])

.controller('AppCtrl', function($scope, $rootScope) {
    $scope.$on('$stateChangeSuccess', function(event, toState) {
        switch(toState.name) {
            case 'app.contatos':
                $scope.tabColor = 'assertive';
                break;
            case 'app.celula':
                $scope.tabColor = 'positive';
                break;
            case 'app.chamada':
                $scope.tabColor = 'balanced';
                break;
            default:
                $scope.tabColor = 'energized';
        }
    });
});