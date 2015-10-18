angular.module('ojs.directives', ['ionic'])

.directive('ojsList', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            isEmpty: '='
        },
        templateUrl: './app/views/ojs-listbase.html'
    }
})

.directive('ojsItem', function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl: './app/views/ojs-itembase.html'
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
        templateUrl: './app/views/ojs-formbase.html',
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
		link: function(scope, elm, attrs) {
            var parentScope = scope.$parent;
            
            parentScope.$on('$ionicView.enter', function() {
                $ionicPopover.fromTemplateUrl(attrs.template, {
                    scope: scope,
                    animation: 'scale-in'
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
}])

.directive("format", ['$filter', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            var decimals = attrs.decimals ? parseInt(attrs.decimals) : 1,
                parser = function(value) {
                    return value;
                },
                formatter = function() {};
            
            function currencyParser(value) {
				var actualNumber = value.replace(/[^\d]+/g,''),
                    formatedValue;
                
				actualNumber = actualNumber.replace(/^[0]+([1-9])/,'$1');
				formatedValue = parseInt(actualNumber) / Math.pow(10, decimals);
                
                elem[0].value = formatedValue.toFixed(decimals).toString();
                
                return elem[0].value;
            }
            
            switch(attrs.type) {
                case 'date':
                case 'datetime':
                case 'datetime-local':
                    formatter = function(value) {
                        if (!ctrl.$isEmpty(value)) {
                            return new Date(value);
                        }
                    };
                    break;
                case 'tel':
                case 'text':
                    if (attrs.decimals && attrs.decimals.trim() !== '') {
                        formatter = function(value) {
                            if (ctrl.$isEmpty(value)) {
                                return value;
                            }
                            return parseFloat(value).toFixed(decimals).toString();
                        };
                        parser = currencyParser;
                    }
                    break;
            }
            
            ctrl.$formatters.push(formatter);

            ctrl.$parsers.push(parser);
        }
    }
}])

.directive('ojsSelect', ['$ionicModal', function($ionicModal) {
    return {
        restrict : 'E',
        transclude: true,
        scope: {
            items: '=',
            value: '='
        },
        templateUrl: './app/views/ojs-select.html',

        link: function (scope, element, attrs) {
            scope.$on('$ionicView.enter', function() {
                $ionicModal.fromTemplateUrl(attrs.popupTmpl, {
                    scope: scope
                }).then(function(modal) {
                    var bar = angular.element(modal.$el.find('ion-header-bar')[0]);
                    bar.addClass('bar-' + attrs.uiClass);
                    scope.selModal = modal;
                });
            });

            scope.$on('$ionicView.leave', function() {
                scope.selModal.remove();
            });
            
            scope.showItems = function (event) {
                event.preventDefault();
                scope.selModal.show();
            }

            scope.hideItems = function () {
                scope.selModal.hide();
            }

            scope.selectValue = function(value) {
                scope.value = value;
                scope.hideItems();
            }
        }
    };
}]);