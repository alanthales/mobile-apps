angular.module('ojs.directives', [])

.directive('format', ['$filter', function($filter) {
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

.directive('ojsPopover', ['$ionicPopover', function($ionicPopover) {
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
                openMenu: function(item, e, vibrate) {
                    this.selectedItem = item;
                    
                    if (vibrate && window.navigator.vibrate) {
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

.directive('ojsSelect', ['$ionicModal', function($ionicModal) {
    return {
        restrict : 'E',
        transclude: true,
        scope: {
            items: '=',
            value: '='
        },
        templateUrl: './app/templates/ojs-select.html',

        link: function (scope, element, attrs) {
            var name = attrs.name || 'selModal';
            
            $ionicModal.fromTemplateUrl(attrs.popupTmpl, {
                scope: scope
            }).then(function(modal) {
                var bars = modal.$el.find('ion-header-bar');
                bars.addClass('bar-' + attrs.uiClass);
                scope[name] = modal;
            });

            scope.$on('$destroy', function() {
                scope[name].remove();
            });
            
            scope.showItems = function (event) {
                event.preventDefault();
                scope[name].show();
            }

            scope.hideItems = function () {
                scope[name].hide();
            }

            scope.selectValue = function(value) {
                scope.value = value;
                scope.hideItems();
            }
        }
    };
}]);