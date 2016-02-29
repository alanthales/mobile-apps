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
});