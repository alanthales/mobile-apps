angular.module('budget.bemvindo', [])
.controller('BemVindoCtrl', function($scope, $rootScope, $ionicSlideBoxDelegate, $state) {
    $scope.actualSlide = 0;
    
    $scope.disableSlide = function() {
        $ionicSlideBoxDelegate.enableSlide(false);
    }
    
    $scope.slideTo = function(index) {
        $ionicSlideBoxDelegate.slide(index);
    }
    
    $scope.validate = function(form) {
        if (form.$valid) {
            window.localStorage.setItem('usuario', JSON.stringify( $rootScope.user ));
            $state.go('app.dashboard');
        };
    }
});