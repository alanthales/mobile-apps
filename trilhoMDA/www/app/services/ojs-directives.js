angular.module('ojs.directives', ['ionic'])

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
        templateUrl: '/app/views/ojs-formbase.html',
        link: function(scope, elm, attrs) {
            var bar = elm.find('ion-header-bar'),
                btn = angular.element(elm[0].querySelector('button[type="submit"]'));
            bar.addClass('bar-' + attrs.uiClass);
            btn.addClass('button-' + attrs.uiClass);
        }
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
                },
                
                closeModal: function() {
                    parentScope.$ojsModal.remove();
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
                        parentScope.$ojsPopMenu = popover;
                        parentScope.$ojsPopMenu.show(e);
                    });
                },

                closeMenu: function() {
                    parentScope.$ojsPopMenu.remove();
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
                if (modelValue) {
                    return new Date(modelValue);
                }
            });
        }
    }
});