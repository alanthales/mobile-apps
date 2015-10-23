angular.module('db.dao', ['ionic'])

.factory('$dao', function() {
    var contatos = db.createDataSet('contatos'),
        celulas = db.createDataSet('celulas'),
        chamadas = db.createDataSet('chamadas'),
        trilhos = db.createDataSet('trilhos');
    
//    function clone(obj) {
//        var newObj = {},
//            key, i;
//        for (key in obj) {
//            if (obj[key].constructor === Array) {
//                newObj[key] = [];
//                for (i = 0; i < obj[key].length; i++) {
//                    newObj[key].push(
//                        cloneObject(obj[key][i])
//                    );
//                }
//                continue;
//            }
//            if (typeof obj[key] === 'object') {
//                newObj[key] = cloneObject(obj[key]);
//                continue;
//            }
//            if (obj.hasOwnProperty(key)) {
//                newObj[key] = obj[key];
//            }
//        }
//        return newObj;
//    };
    
    return {
        getContatos: function(callback, opts) {
            if (opts && opts.sort) {
                contatos.sortBy = opts.sort;
            }
            contatos.open(callback);
            return contatos;
        },
        getCelulas: function(callback) {
            celulas.open(callback);
            return celulas;
        },
        getChamadas: function(callback) {
            chamadas.open(callback);
            return chamadas;
        },
        getTrilhos: function(callback) {
            trilhos.open(callback);
            return trilhos;
        },
        cloneObject: function(obj) {
            if (Object.prototype.toString.call(obj) === '[object Array]') {
                var out = [], i = 0, len = obj.length;
                for ( ; i < len; i++ ) {
                    out[i] = arguments.callee(obj[i]);
                }
                return out;
            }
            if (typeof obj === 'object') {
                var out = {}, i;
                for ( i in obj ) {
                    out[i] = arguments.callee(obj[i]);
                }
                return out;
            }
            return obj;
        }
    }
});