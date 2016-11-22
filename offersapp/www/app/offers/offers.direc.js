angular.module('offersapp.offers', [])
.directive('offers', function() {
	return {
		restrict: 'E',
		scope: {
			data: '=',
			filter: '=',
			eof: '=',
			loadMore: '&'
		},
		controller: ['$state', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', function($state, $timeout, ionicMaterialInk, ionicMaterialMotion) {
			this.showOffer = function(offer) {
				$state.go('app.offersdetail', { id: offer.id });
			};
			
			ionicMaterialInk.displayEffect();

			if (!this.data.length) { return; }

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