angular.module('offersapp.offersdetail', [])
.controller('OffersDetailCtrl', function($scope, $timeout, oferta, lista, PopupServ, ionicMaterialInk, ionicMaterialMotion) {
    var self = this;
    
    this.tabIndex = 0;
    this.oferta = oferta;
    this.lista = lista;
    
    this.add = function(oferta) {
        var l = self.lista.data.length;
        
        self.lista.save(oferta);
        self.lista.post();
        
        if (l < self.lista.data.length) {
            PopupServ.toast('Oferta adicionada na lista');
        }
    };
    
    this.changeTab = function(index) {
        self.tabIndex = index;
        if (index === 1) {
            self.loadMap();
        }
    };
    
    this.loadMap = function() {
        var anunciante = self.oferta.usuario,
            endereco = [anunciante.endereco, ',', anunciante.numero, '-', anunciante.cidade.nome, ' ', anunciante.cidade.estado].join(' '),
            geocoder = new google.maps.Geocoder(),
            mapOptions = {
                center: {lat: -34.397, lng: 150.644},
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            map = new google.maps.Map(document.getElementById('map'), mapOptions);

        geocoder.geocode({ 'address': endereco }, function(results, status) {
            if (status != google.maps.GeocoderStatus.OK || status == google.maps.GeocoderStatus.ZERO_RESULTS) {
                return;
            }

            map.setCenter(results[0].geometry.location);

            var infowindow = new google.maps.InfoWindow({
                    content: [
                        '<b>',
                            anunciante.razao,
                        '</b>',
                        '<br/>',
                        endereco
                    ].join(''),
                    size: new google.maps.Size(150,50)
                }),
                marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map,
                    title: anunciante.razao
                });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });
        });
    };
    
    ionicMaterialInk.displayEffect();
    
    $timeout(function() {
        ionicMaterialMotion.slideUp({ selector: '.slide-up' });
    }, 250);
});