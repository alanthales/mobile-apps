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

.directive('donate', ['$ionicModal', function($ionicModal) {
    return {
        restrict : 'E',
        scope: {
            hidden: '@',
            lnkClass: '@'
        },
        template:
            [
                '<div class="list list-inset" ng-hide="hidden">',
                '    <div class="item item-divider">',
                '        Ajude-nos a manter o projeto',
                '        <a href="#" class="item-right dark" ng-click="hidden = true">',
                '            <i class="icon ion-android-close"></i>',
                '        </a>',
                '    </div>',
                '    <div class="item">',
                '        Toque <a href="#" class="{{lnkClass}}" ng-click="openModal($event)">aqui</a> para ajudar.',
                '    </div>',
                '</div>'
            ].join(''),

        link: function (scope, element, attrs) {
            var name = attrs.name || 'selModal';
            
            $ionicModal.fromTemplateUrl(attrs.template, {
                scope: scope
            }).then(function(modal) {
                scope[name] = modal;
            });

            scope.$on('$destroy', function() {
                scope[name].remove();
            });
            
            scope.openModal = function(event) {
                event.preventDefault();
                scope[name].show();
            }

            scope.closeModal = function() {
                scope[name].hide();
            }
            
            scope.goDonate = function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.open(e.target.dataset.action, '_system');
            }
        }
    }
}])

.directive('dividerMonthRepeat', function(){
    return {
        priority: 1001,
        compile: compile
    }
    
    function compile(element, attr) {
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