angular.module('offersapp.popup', [])
.service('PopupServ', function($ionicPopup, $ionicLoading) {
	this.alert = function(message) {
		$ionicPopup.alert({
			title: "Offer's App",
			template: message,
			okType: 'button-energized'
		}).then();
	};
	
	this.show = function(scope, template) {
		return $ionicPopup.show({
			title: "Offer's App",
			template: template,
			scope: scope,
			buttons: [
				{ text: 'OK', type: 'button-energized' }
			]
		});
	};

	this.toast = function(message) {
		return $ionicLoading.show({
			template: message,
			noBackdrop: true,
			duration: 2500
		});
	};
});