angular.module('offersapp.dao', [])
.factory('DaoFact', function($q, urls, UserStore) {
    var token = btoa('ojs:only-jesus-saves'),
        header = { Authorization: 'Basic ' + token },
        db = new DbFactory(DbProxies.RESTFUL, { url: urls.BACKEND, headers: header }),
        localDb = new DbFactory(DbProxies.LOCALSTORAGE),
        lista = localDb.createDataSet('lista');
    
    var qryPromise = function(table, params) {
        var defer = $q.defer();

        db.query(table, params || {}, function(err, results) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(results);
            }
        });
        
        return defer.promise;
    };
    
    return {
        getCidades: function() {
            return qryPromise('cidade');
        },
        
        getCategorias: function() {
            return qryPromise('categoria');
        },
        
        getOferta: function(id) {
            return qryPromise('oferta/' + id || 0 );
        },

        getOfertas: function(options) {
            var opts = options && typeof options === 'object' ? options : {},
                url = 'oferta?limit=50&';
            
            opts.cidade = opts.cidade || UserStore.getStore().cidade;

            if (opts.skip) {
                url += 'skip=' + opts.skip + '&';
                delete opts.skip;
            }

            url += 'where=' + JSON.stringify(opts);

            return qryPromise(url);
        },
        
        getLista: function() {
            return lista.open();
        }
    };
});