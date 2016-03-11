angular.module('budget.utils', ['ionic'])

.factory('utils', function($http) {
    var local = window.localStorage,
        session = window.sessionStorage,
        urlSIB = window.cordova ? 'https://api.sendinblue.com/v2.0' : '/send',
        config = {
            headers: {
                'Content-Type': 'application/json',
                'api-key': 'DkTMys3BKLQfhOY5'
            }
        };

    
    return {
        WelcomeTmpl: 1,
        
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
            email: function(tmplId, toEmail, toName, subject, success, error) {
                var url = urlSIB + '/template/' + tmplId,
                    data = {
                        to: toEmail,
                        attr: {'NOME': toName, 'ASSUNTO': subject},
                        headers: {'Content-Type': 'text/html;charset=iso-8859-1'}
                    };
                
                console.log('email', data);
                $http.post(url, data, config).then(
                    function(res) {
                        if (typeof success === 'function') {
                            success(res);
                        }
                    },
                    function(err) {
                        if (typeof error === 'function') {
                            error(res);
                        }
                    });
            },
            emailText: function(to, subject, body, success, error) {
                var url = urlSIB + '/email',
                    data = {
                        to: to,
                        from: ['noreply@ftogether.com'],
                        subject: subject,
                        html: body
                    };
                
                console.log('emailText', data);
                $http.post(url, data, config).then(
                    function(res) {
                        if (typeof success === 'function') {
                            success(res);
                        }
                    },
                    function(err) {
                        if (typeof error === 'function') {
                            error(res);
                        }
                    });
            },
            sms: function(to, text, success, error) {
                var url = urlSIB + '/sms',
                    data = {
                        to: to,
                        from: 'ftogether',
                        text: text,
                        type: 'transactional'
                    };
                
                console.log('sms', data);
                $http.post(url, data, config).then(
                    function(res) {
                        if (typeof success === 'function') {
                            success(res);
                        }
                    },
                    function(err) {
                        if (typeof error === 'function') {
                            error(res);
                        }
                    });
            }
        }
    }
});