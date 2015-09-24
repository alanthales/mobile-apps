angular.module('ojs.directives', ['ionic'])

.directive('ojsNavBar', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<ion-nav-buttons side="right"><button class="right button button-icon ion-android-add" ng-click="newItem()"></button></ion-nav-buttons>'
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
})

.directive('ojsForm', function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            title: '@',
            hideModal: '&',
            saveRecord: '&'
        },
        templateUrl: '/app/views/ojs-formbase.html'
    }
})

.directive("formatDate", function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, modelCtrl) {
            modelCtrl.$formatters.push(function(modelValue) {
                return new Date(modelValue);
            });
        }
    }
})

.directive("ojsPopMenu", function() {
    return {
        restrict: 'A',
        require: 'ionView',
        controller: function($scope, $ionicPopover) {
            $ionicPopover.fromTemplateUrl('app/views/ojs-popmenu.html', {
                scope: $scope,
                animation: 'fade-out'
            }).then(function(popover) {
                $scope.popover = popover;
            });
            
            $scope.$on('$destroy', function() {
                $scope.popover.remove();
            });
        }
    }
});