var _credentials = {
    accessKeyId: atob('QUtJQUlPM0NFQkdNQkNRNkVRV0E='),
    secretAccessKey: atob('U1BYVlFWSkc0aEttMno2OUtrTWw4UnNtSUMxV2pyVVkxZmh3MmprTw==')
};

AWS.config.update(_credentials);

angular.module('budget.utils', ['ionic'])

.factory('utils', function($http) {
    var local = window.localStorage,
        session = window.sessionStorage,
        ses = new AWS.SES();

    var _replace = function(text, obj) {
        var result = text,
            tag, prop;
        for (prop in ojb) {
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
                var html = _replace(body, obj),
                    params = {
                        Destination: {
                            ToAddresses: [toEmail]
                        },
                        Message: {
                            Body: {
                                Html: {
                                    Data: html
                                }
                            },
                            Subject: {
                                Data: subject
                            }
                        },
                        Source: 'alanthales@gmail.com'
                    };
                
                console.log('sender.email', params);
                
                ses.sendEmail(params, function(err, data) {
                    if (err) {
                        console.log( JSON.stringify(err) );
                        if (typeof error === 'function') {
                            error(err);
                        }
                        return;
                    }
                    if (typeof success === 'function') {
                        success(data);
                    }
                });
            }
        }
    }
});