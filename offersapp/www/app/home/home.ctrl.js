angular.module('offersapp.home', [])
.controller('HomeCtrl', function($scope, $timeout, ofertas, DaoFact){
	var self = this,
		page = 1;
	
	this.ofertas = ofertas;
	this.eof = ofertas.length < 30;

	this.loadMore = function() {
		var filter = { skip: page * 30 };
		
		DaoFact.getOfertas(filter).then(function(data) {
			self.ofertas.putRange(data, true);
			self.eof = data.length < 30;
		});

		page++;
	};
	
	$timeout(function() {
		document.getElementsByClassName('button-fab-top-right')[0].classList.toggle('on');
	}, 300);
});