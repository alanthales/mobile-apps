angular.module('budget.utils', ['ionic'])

.factory('utils', function($http) {
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