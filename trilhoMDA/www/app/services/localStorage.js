angular.module('trilhoMDA.utils', [])

.factory('$localstorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            if (value && typeof value === 'object') {
                $window.localStorage[key] = JSON.stringify(value);
            } else {
                $window.localStorage[key] = value;
            }
        },
        get: function(key, defaultValue) {
            var value = $window.localStorage[key];
            if (value && typeof value === 'object') {
                return JSON.parse(value);
            }
            return value;
        }
    }
}]);
