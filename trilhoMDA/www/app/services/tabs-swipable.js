angular.module('tabs.swipable', ['ionic'])

.directive('tabsSwipable', ['$ionicGesture', function($ionicGesture) {
	return {
		restrict: 'A',
		require: 'ionTabs',
		link: function(scope, elm, attrs, tabsCtrl) {
			var onSwipeLeft, onSwipeRight, swipeGesture;
                
            onSwipeLeft = function() {
				var target = tabsCtrl.selectedIndex() + 1;
				if (target < tabsCtrl.tabs.length) {
					scope.$apply(tabsCtrl.select(target));
				}
			};
            
			onSwipeRight = function(){
				var target = tabsCtrl.selectedIndex() - 1;
				if (target >= 0) {
					scope.$apply(tabsCtrl.select(target));
				}
			};
		    
		    swipeGesture = $ionicGesture.on('swipeleft', onSwipeLeft, elm).on('swiperight', onSwipeRight, elm);
            
		    scope.$on('$destroy', function() {
		        $ionicGesture.off(swipeGesture, 'swipeleft', onSwipeLeft);
		        $ionicGesture.off(swipeGesture, 'swiperight', onSwipeRight);
		    });
		}
	};
}])

.directive('hideTabs', function() {
    var style = angular.element('<style>').html([
            '.hide-tab {display: none}',
            '.content-top {top: 36px}'
        ].join(' '));
    
    document.head.appendChild(style[0]);
    
    return {
		restrict: 'A',
		require: 'ionView',
		link: function(scope, elm, attrs, ctrl) {
            var tabs = angular.element(document.querySelector('.tab-nav')),
                content = elm.find('ion-content');
            scope.$on('$ionicView.beforeEnter', function() {
                content.addClass('content-top');
                tabs.addClass('hide-tab');
            });
            scope.$on('$ionicView.beforeLeave', function() {
                content.removeClass('content-top');
                tabs.removeClass('hide-tab');
            });
        }
	};
});