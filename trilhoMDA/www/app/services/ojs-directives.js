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
            saveRecord: '&',
            closeForm: '&'
        },
        templateUrl: '/app/views/ojs-formbase.html'
    }
})

.directive('ojsModal', ['$ionicModal', function($ionicModal) {
	return {
		restrict: 'E',
		require: '^?ionContent',
		link: function(scope, elm, attrs) {
            var parentScope = scope.$parent;

            parentScope[attrs.name] = {
                openModal: function() {
                    $ionicModal.fromTemplateUrl(attrs.template, function(modal) {
                        parentScope.$ojsModal = modal;
                        parentScope.$ojsModal.show();
                    },{
                        scope: scope,
                        animation: 'slide-in-up',
                        backdropClickToClose: false,
                        hardwareBackButtonClose: false
                    });
                }
            }
		}
	};
}])
    
.directive("ojsPopMenu", ['$ionicPopover', function($ionicPopover) {
    return {
        restrict: 'E',
        require: '^?ionContent',
		link: function(scope, elm, attrs) {
            var parentScope = scope.$parent;
            
            parentScope[attrs.name] = {
                openMenu: function(e) {
                    $ionicPopover.fromTemplateUrl(attrs.template, {
                        scope: scope,
                        animation: 'fade-out',
                        backdropClickToClose: false,
                        hardwareBackButtonClose: false
                    }).then(function(popover) {
                        parentScope.popover = popover;
                        parentScope.popover.show(e);
                    });
                },

                closeMenu: function() {
                    parentScope.popover.remove();
                }
            }
        }
    }
}])

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
});