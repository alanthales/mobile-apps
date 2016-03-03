angular.module('budget.directives', ['ionic'])

.directive('formBase', function() {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            title: '@',
            saveRecord: '&',
            closeForm: '&'
        },
        templateUrl: './app/templates/formbase.html',
        link: function(scope, elem, attrs) {
            scope.$parent.$parent.$parent[attrs.name] = scope[attrs.name];
        }
    }
})
.directive('backButton', function() {
    return {
        restrict: 'E',
        scope: {
            title: '@',
            goBack: '&'
        },
        template: '<a class="item item-icon-left" ng-click="goBack()"><i class="icon icon-small ion-chevron-left"></i>{{title}}</a>'
    }
});