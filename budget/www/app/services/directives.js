angular.module('budget.directives', ['ionic'])

.directive('formBase', function() {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            title: '@',
            saveRecord: '&',
            closeForm: '&'
        },
        templateUrl: './app/templates/formbase.html',
        link: function(scope, elem, attrs) {
            scope.$parent.$parent.$parent[attrs.name] = scope[attrs.name];
        }
    }
})

.directive('backButton', function() {
    return {
        restrict: 'E',
        scope: {
            title: '@',
            goBack: '&'
        },
        template: '<a class="item item-icon-left" ng-click="goBack()"><i class="icon icon-small ion-chevron-left"></i>{{title}}</a>'
    }
})

.directive('markers', function() {
    return {
        restrict: 'E',
        scope: {
            marks: '='
        },
        template: 
            [
                '<a class="item item-icon-left" ng-repeat="item in marks track by $index" menu-close href="#/app/despmarcador/{{item.id}}">',
                    '<i class="icon icon-small ion-pricetag"></i>',
                    '{{item.descricao}}',
                '</a>'
            ].join('')
    }
})

.directive('compareTo', function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    }
})

.directive('dividerMonthRepeat', function(){
    return {
        priority: 1001,
        compile: compile
    }
    
    function compile(element, attr) {
        console.log(attr.showYear);
        var height = attr.itemHeight || '53',
            showYear = attr.showYear != null,
            showTotal = attr.showTotal != null,
            yearSpan = showYear ? ', {{item.year}}' : '',
            totalSpan = showTotal ? '<span class="item-right">={{item.total | currency:"R$"}}</span>' : '';
                    
        attr.$set('itemHeight', 'item.isDivider ? 37 : ' + height);
        element.children().attr('ng-hide', 'item.isDivider');        
        element.prepend([
            '<div class="item item-divider ng-hide" ng-show="item.isDivider">',
            '   {{$root.listaMes[item.month]}}', yearSpan, totalSpan,             
            '</div>'
        ].join(''));        
    }
});