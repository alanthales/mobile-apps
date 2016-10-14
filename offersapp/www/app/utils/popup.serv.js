angular.module('offersapp.popup', [])
.service('PopupServ', function($ionicPopup) {
    this.show = function(scope, template) {
        return $ionicPopup.show({
            title: "Offer's App",
            template: template,
            scope: scope,
            buttons: [
                { text: 'OK', type: 'button-balanced' }
            ]
        });
    };
});