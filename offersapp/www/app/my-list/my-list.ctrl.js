angular.module('offersapp.my-list', [])
.controller('MyListCtrl', function($scope, $timeout, DaoFact, ionicMaterialInk, ionicMaterialMotion) {
    var self = this;
    
    this.lista = DaoFact.getLista();
    
    this.save = function(oferta) {
        this.lista.save(oferta);
        this.lista.post();
    };
    
    this.clearSelecteds = function() {
        var mylist = this.lista,
            toDelete = mylist.filter({ selected: true });
        
        if (!toDelete.length) return;
        
        toDelete.forEach(function(item) {
            mylist.delete(item);
        });
        
        mylist.post();
    };
    
    ionicMaterialInk.displayEffect();

    $timeout(function() {
        if (!self.lista.data.length) return;
        
        ionicMaterialMotion.fadeSlideInRight({
            selector: '.animate-fade-slide-in .item'
        });
    }, 300);
});