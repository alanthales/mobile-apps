angular.module('offersapp.popup', [])
.service('PopupServ', function($ionicPopup, $timeout) {
    this.alert = function(message) {
        var popup = $ionicPopup.alert({
            title: "Offer's App",
            template: message,
            okType: 'button-energized'
        }).then();
        
        $timeout(function() {
            popup.close();
        }, 3000);
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
});