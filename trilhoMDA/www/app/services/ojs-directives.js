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

.directive("format", ['$filter', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            var parser = function(value) {
                    return value;
                },
                formatter = function() {};
            
            function currencyParser(value) {
				var actualNumber = value.replace(/[^\d]+/g,''),
                    decimals = parseInt(attrs.decimals),
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
                case 'number':
                case 'text':
                    if (attrs.decimals && attrs.decimals.trim() !== '') {
                        formatter = function(value) {
                            return $filter('number')(ctrl.$modelValue);
                        };
                        parser = currencyParser;
                    }
                    break;
            }
            
            ctrl.$formatters.push(formatter);

            ctrl.$parsers.push(parser);
        }
    }
}]);