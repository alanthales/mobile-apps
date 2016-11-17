angular.module('offersapp.search', [])
.controller('SearchCtrl', function($scope, $timeout, DaoFact) {
	var self = this,
		timer;

	this.ofertas = [];
	this.search = '';

	$scope.$watch('ctrl.search', function(newValue, oldValue) {
		if (timer) { $timeout.cancel(timer); }
		if (newValue.trim() === '') { return; }

		timer = $timeout(function() {
			var words = newValue.split(' '),
				criteria = { or: [] },
				w;

			for (w in words) {
				criteria.or.push({ descricao: {'contains': w}});
			}

			DaoFact.getOfertas(criteria).then(loadOffers);
		}, 300);

		function loadOffers(results) {
			self.ofertas = results;
		};
	});
});