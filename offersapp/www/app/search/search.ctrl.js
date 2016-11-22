angular.module('offersapp.search', [])
.controller('SearchCtrl', function($scope, $timeout, DaoFact) {
	var self = this,
		content = document.getElementsByClassName('search-content'),
		nodata, criteria, timer;

	this.ofertas = [];
	this.search = '';
	this.eof = true;

	$scope.$watch('ctrl.search', function(newValue, oldValue) {
		if (timer) { $timeout.cancel(timer); }
		if (newValue.trim() === '') { return; }

		timer = $timeout(function() {
			var words = newValue.split(' '),
				i = 0;
				
			criteria = { limit: 100, or: [] };

			for (; i < words.length; i++) {
				criteria.or.push({ descricao: {'contains': words[i]}});
			}

			DaoFact.getOfertas(criteria).then(loadOffers);
		}, 300);

		function loadOffers(results) {
			self.ofertas = results;
			if (nodata.length) {
				nodata[0].style.display = 'block';
			}
		};
	});

	$timeout(function() {
		nodata = content[0].getElementsByClassName('list no-data');		
		nodata[0].style.display = 'none';
	}, 250);
});