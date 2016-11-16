angular.module('offersapp.bemvindo', [])
.controller('BemvindoCtrl', function($scope, cidades, $ionicSlideBoxDelegate, $state, $ionicLoading, UserStore) {
	this.user = {};
	this.cidades = cidades;

	this.actualSlide = 0;
	
	this.disableSlide = function() {
		$ionicSlideBoxDelegate.enableSlide(false);
	};
	
	this.next = function() {
		if (!this.user.cidade) {
			return $ionicLoading.show({
				template: 'Selecione uma cidade',
				duration: 3000
			});
		}
		
		$ionicSlideBoxDelegate.slide(1);
	};
	
	this.done = function() {
		UserStore.setStore(this.user);
		$state.go('app.home');
	};
});