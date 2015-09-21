angular.module('ojs.directives', ['ionic'])

.directive('ojsNavBar', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<ion-nav-buttons side="right"><button class="right button button-icon ion-plus" ng-click="newItem()"></button></ion-nav-buttons>'
    }
})

.directive('ojsList', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            isEmpty: '='
        },
        templateUrl: '/app/views/ojs-listbase.html'
    }
})

.directive('ojsItem', function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl: '/app/views/ojs-itembase.html'
    }
});