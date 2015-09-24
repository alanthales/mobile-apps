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

.directive('ojsTemplate', ['$ionicModal', function($ionicModal) {
	return {
		restrict: 'A',
		require: 'ionView',
		link: function(scope, elm, attrs) {
            $ionicModal.fromTemplateUrl(attrs.ojsTemplate, {
                scope: scope,
                animatioin: 'slide-up'
            }).then(function(modal) {
                scope.modal = modal;
            });
            
		    scope.$on('$destroy', function() {
                scope.modal.remove();
		    });
		}
	};
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
})

.directive("ojsPopMenu", ['$ionicPopover', function($ionicPopover) {
    return {
        restrict: 'E',
        replace: true,
		link: function(scope, elm, attrs) {
            $ionicPopover.fromTemplateUrl(attrs.template, {
                scope: scope,
                animation: 'fade-out'
            }).then(function(popover) {
                scope.popover = popover;
            });
            
            scope.$on('$destroy', function() {
                scope.popover.remove();
            });
        }
    }
}]);