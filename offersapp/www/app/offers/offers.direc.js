angular.module('offersapp.offers', [])
.directive('offers', function() {
    return {
        restrict: 'E',
        scope: {
            data: '=',
            filter: '='
        },
        controller: ['$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', function($timeout, ionicMaterialInk, ionicMaterialMotion) {
            this.showOffer = function(offer) {
                console.log(offer);
            };
            
            ionicMaterialInk.displayEffect();

            $timeout(function() {
                ionicMaterialMotion.fadeSlideInRight({
                    selector: '.animate-fade-slide-in .card-item'
                });
            }, 500);
        }],
        controllerAs: 'ctrl',
        bindToController: true,
        templateUrl: './app/offers/offers.tmpl.html'
    }
});