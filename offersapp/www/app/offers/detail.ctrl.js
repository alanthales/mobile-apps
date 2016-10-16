angular.module('offersapp.offersdetail', [])
.controller('OffersDetailCtrl', function($scope, $stateParams, DaoFact, ionicMaterialInk, ionicMaterialMotion) {
    var ofertaId = $stateParams.id ? parseInt($stateParams.id) : 0;
    
    this.oferta = DaoFact.getOfertas().getById(ofertaId);
        
    ionicMaterialMotion.fadeSlideInRight();
    
    ionicMaterialInk.displayEffect();
    
    var anunciante = this.oferta.anunciante,
        endereco = [anunciante.endereco, ',', anunciante.numero, '-', anunciante.cidade, ' ', anunciante.estado].join(' '),
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
});