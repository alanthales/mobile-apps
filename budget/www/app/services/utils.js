angular.module('budget.utils', ['ionic'])

.factory('utils', function($http, $ionicModal) {
    var local = window.localStorage,
        session = window.sessionStorage,
        sibUrl = window.cordova ? 'https://api.sendinblue.com/v2.0' : '/send',
        sibConfig = {
            headers: {
                'Content-type': 'application/json',
                'api-key': 'DkTMys3BKLQfhOY5'
            }
        };

    var _replace = function(text, obj) {
        var result = text,
            tag, prop;
        for (prop in obj) {
            tag = '{' + prop + '}';
            result = result.replace(tag, obj[prop]);
        }
        return result;
    };
    
    return {
        WelcomeMail: [
            '<p>Olá <strong>{nome}</strong>,</p>',
            '<p>Seja bem vindo ao Finances Together!</p>',
            '<p>Sua senha para acessar o aplicativo: <strong>{senha}</strong></p>'
        ].join(''),
        
        replaceWith: _replace,
        
        hasConnection: function() {
            if (!navigator.connection) {
                return false;
            }

            var states = {}

            states[Connection.WIFI] = 'Wifi connection';
            states[Connection.CELL_3G] = '3G connection';
            states[Connection.CELL_4G] = '4G connection';

            return navigator.connection.type in states;
        },
        
        lStorage: {
            setItem: function(key, value) {
                local.setItem(key, JSON.stringify(value));
            },
            getItem: function(key) {
                var obj = local.getItem(key);
                return obj ? JSON.parse(obj) : {};
            }
        },
        
        sStorage: {
            setItem: function(key, value) {
                session.setItem(key, JSON.stringify(value));
            },
            getItem: function(key) {
                var obj = session.getItem(key);
                return obj ? JSON.parse(obj) : {};
            }
        },
        
        initModal: function(template, scope) {
            scope.$on('$ionicView.enter', function() {
                $ionicModal.fromTemplateUrl(template, {
                    scope: scope,
                    animation: 'slide-in-up',
                    backdropClickToClose: false,
                    hardwareBackButtonClose: false
                }).then(function(modal) {
                    scope.modal = modal;
                });
            });

            scope.$on('$ionicView.leave', function() {
                scope.modal.remove();
            });
        },
        
        reGroup: function(list, oldProp, newProp, aggProp) {
            var result = new ArrayMap(),
                i, obj;
            
            list.forEach(function(item) {
                for (i = 0; i < item[oldProp].length; i++) {
                    obj = angular.copy(item);
                    delete obj[oldProp];
                    obj[newProp] = item[oldProp][i];
                    obj.aggregated = i === 0 ? item[aggProp] : 0;
                    result.put(obj);
                }
            });
            
            return result;
        },
        
        sender: {
            email: function(toEmail, obj, subject, body, success, error) {
                var url = sibUrl + '/email',
                    html = _replace(body, obj),
                    data = {
                        to: toEmail,
                        from: ["noreply@ftogether.com"],
                        subject: subject,
                        html: html
                    };
                
                $http.post(url, data, sibConfig).then(
                    function(res) {
                        console.log('sender.email success', JSON.stringify(res));
                        if (typeof success === 'function') {
                            success(res);
                        }
                    },
                    function(res) {
                        console.log('sender.email error', JSON.stringify(res));
                        if (typeof error === 'function') {
                            error(res);
                        }
                    });
            }
        }
    }
});