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
}])

.directive('ojsSelect', ['$ionicModal', function($ionicModal) {
    return {
        restrict : 'E',
        templateUrl: './app/views/ojs-select.html',

        scope: {
            'items'        : '=', /* Items list is mandatory */
            'text'         : '=', /* Displayed text is mandatory */
            'value'        : '=', /* Selected value binding is mandatory */
            'callback'     : '&'
        },

        link: function (scope, element, attrs) {
            /* Default values */
            scope.allowEmpty = attrs.allowEmpty === 'false' ? false : true;

            /* Header used in ion-header-bar */
            scope.headerText = attrs.headerText || '';

            /* Text displayed on label */
            // scope.text          = attrs.text || '';
            scope.defaultText = scope.text || '';

            /* Notes in the right side of the label */
            scope.noteText     = attrs.noteText || '';
            scope.noteImg      = attrs.noteImg || '';
            scope.noteImgClass = attrs.noteImgClass || '';

            /* Optionnal callback function */
            // scope.callback = attrs.callback || null;

            /* Instanciate ionic modal view and set params */

            /* Some additionnal notes here : 
             * 
             * In previous version of the directive,
             * we were using attrs.parentSelector
             * to open the modal box within a selector. 
             * 
             * This is handy in particular when opening
             * the "fancy select" from the right pane of
             * a side view. 
             * 
             * But the problem is that I had to edit ionic.bundle.js
             * and the modal component each time ionic team
             * make an update of the FW.
             * 
             * Also, seems that animations do not work 
             * anymore.
             * 
             */
            $ionicModal.fromTemplateUrl('./app/views/ojs-selectitem.html', {
                'scope': scope
            }).then(function(modal) {
                scope.selModal = modal;
            });

            /* Validate selection from header bar */
            scope.validate = function (event) {
                // Select first value if not nullable
                if (typeof scope.value == 'undefined' || scope.value == '' || scope.value == null ) {
                    if (scope.allowEmpty == false) {
                        scope.value = scope.items[0].id;
                        scope.text = scope.items[0].text;

                        // Check for multi select
                        scope.items[0].checked = true;
                    } else {
                        scope.text = scope.defaultText;
                    }
                }

                // Hide modal
                scope.hideItems();

                // Execute callback function
                if (typeof scope.callback == 'function') {
                    scope.callback (scope.value);
                }
            }

            /* Show list */
            scope.showItems = function (event) {
                event.preventDefault();
                scope.selModal.show();
            }

            /* Hide list */
            scope.hideItems = function () {
                scope.selModal.hide();
            }

            /* Destroy modal */
            scope.$on('$destroy', function() {
                scope.selModal.remove();
            });

            /* Validate single with data */
            scope.validateSingle = function (item) {
                // Set selected text
                scope.text = item.text;

                // Set selected value
                scope.value = item.id;

                // Hide items
                scope.hideItems();

                // Execute callback function
                if (typeof scope.callback == 'function') {
                    scope.callback (scope.value);
                }
            }
        }
    };
}]);