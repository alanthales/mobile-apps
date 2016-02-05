angular.module('ojs.directives', ['ionic'])

.directive('ojsForm', function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            title: '@',
            saveRecord: '&',
            closeForm: '&'
        },
        templateUrl: './app/views/templates/ojs-formbase.html',
        link: function(scope, elm, attrs) {
            var bar = elm.find('ion-header-bar'),
                btn = angular.element(elm[0].querySelector('button[type="submit"]'));
            bar.addClass('bar-' + attrs.uiClass);
            btn.addClass('button-' + attrs.uiClass);
        }
    }
});