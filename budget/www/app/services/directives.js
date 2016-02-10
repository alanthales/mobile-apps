angular.module('budget.directives', ['ionic'])

.directive('formBase', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@',
            saveRecord: '&',
            closeForm: '&'
        },
        templateUrl: './app/templates/formbase.html'
    }
})

.directive('popoverMenu', ['$ionicPopover', function($ionicPopover) {
    return {
        restrict: 'E',
		link: function(scope, elm, attrs) {
            var parentScope = scope.$parent;
            
            parentScope.$on('$ionicView.enter', function() {
                $ionicPopover.fromTemplateUrl(attrs.template, {
                    scope: scope
                }).then(function(popover) {
                    parentScope.$ojsPopMenu = popover;
                });
            });
            
            parentScope.$on('$ionicView.leave', function() {
                parentScope.$ojsPopMenu.remove();
            });
            
            parentScope[attrs.name] = {
                openMenu: function(e) {
                    if (window.navigator.vibrate) {
                        window.navigator.vibrate(200);
                    }
                    parentScope.$ojsPopMenu.show(e);
                },

                closeMenu: function() {
                    parentScope.$ojsPopMenu.hide();
                }
            }
        }
    }
}]);