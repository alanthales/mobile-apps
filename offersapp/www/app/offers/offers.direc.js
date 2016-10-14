angular.module('offersapp.offers', [])
.directive('offers', function() {
    return {
        restrict: 'E',
        scope: {
            data: '=',
            filter: '='
        },
        controller: ['$state', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', function($state, $timeout, ionicMaterialInk, ionicMaterialMotion) {
            this.showOffer = function(offer) {
                $state.go('app.offersdetail', { id: offer.id });
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