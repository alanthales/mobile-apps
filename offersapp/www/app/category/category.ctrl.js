angular.module('offersapp.category', [])
.controller('CategoryCtrl', function($scope, categoria, ofertas, DaoFact) {
	var self = this,
		page = 1;

    this.categoria = categoria;
	this.ofertas = ofertas;
	this.eof = ofertas.length < 30;

	this.loadMore = function() {
		var filter = {
			skip: page * 30,
			categoria: self.categoria.id
		};
		
		DaoFact.getOfertas(filter).then(function(data) {
			self.ofertas.putRange(data, true);
			self.eof = data.length < 30;
		});

		page++;
	};
});