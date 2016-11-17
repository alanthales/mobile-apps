angular.module('offersapp.userstore', [])
.service('UserStore', function($window) {
	var store = JSON.parse( $window.localStorage.getItem('user') || '{}' );

	this.setStore = function(data) {
		OjsUtils.cloneProperties(data, store);
		$window.localStorage.setItem('user', JSON.stringify( store ));
	};

	this.getStore = function() {
		return store;
	};
});