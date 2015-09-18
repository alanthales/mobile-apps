angular.module('ionutils.views', ['ionic'])

.directive('ojsView', function() {
    return {
        restrict: 'E',
//        transclude: true,
        scope: true,
        replace: true,
        templateUrl: '/app/views/ojs-listbase.html'
    };
})
;