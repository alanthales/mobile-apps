angular.module('offersapp.dao', [])
.factory('DaoFact', function($q, urls, UserStore) {
    var token = btoa('ojs:only-jesus-saves'),
        header = { Authorization: 'Basic ' + token },
        db = new DbFactory(DbProxies.RESTFUL, { url: urls.BACKEND, headers: header }),
        localDb = new DbFactory(DbProxies.LOCALSTORAGE),
        lista = localDb.createDataSet('lista'),
        cache = {};
    
    var qryPromise = function(table, params) {
        var defer = $q.defer();

        if (['cidade','categoria'].indexOf(table) >= 0 && cache[table]) {
            defer.resolve(cache[table]);
            return defer.promise;
        }

        db.query(table, params || {}, function(err, results) {
            if (err) {
                defer.reject(err);
            } else {
                cache[table] = results;
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
                url = 'oferta?';
            
            opts.limit = opts.limit || 30;
            opts.cidade = opts.cidade || UserStore.getStore().cidade;

            url += 'limit=' + opts.limit + '&';
            delete opts.limite;

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