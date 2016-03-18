var _credentials = {
    accessKeyId: atob('QUtJQUlPM0NFQkdNQkNRNkVRV0E='),
    secretAccessKey: atob('U1BYVlFWSkc0aEttMno2OUtrTWw4UnNtSUMxV2pyVVkxZmh3MmprTw==')
};

AWS.config.update(_credentials);

angular.module('budget.syncSDB', ['ionic'])

.factory('SyncSDB', function($rootScope) {
    var _db = new AWS.SimpleDB({ region: 'sa-east-1' }),
        _regx = new RegExp(/^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/);
    
    var _isJson = function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };
    
    var _parseItem = function(item, itemId) {
        var result = { id: item.Name || itemId },
            value;

        item.Attributes.forEach(function(attr) {
            value = attr.Value;
            
            if (value) {
                if (_regx.test(value)) {
                    value = new Date(value);
                } else if (_isJson(value)) {
                    value = JSON.parse(value, DbProxy.dateParser);
                } else if (value === 'true' || value === 'false') {
                    value = value === 'true';
                }
            }
            
            result[attr.Name] = value;
        });
        
        return result;
    };
    
    var _formatItem = function(item) {
        var result = [],
            prop, value;
        
        for (prop in item) {
            if (prop === 'id') {
                continue;
            }
            
            value = item[prop] || '';

            if (typeof value === 'date') {
                value = value.toISOString();
            } else if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            
            result.push({
                Name: prop, Value: value, Replace: true
            });
        }
        
        return result;
    };
    
    var _getDomain = function(table) {
        return ['budget_', table].join('');
    };
    
    var _getItem = function(table, itemId, success, error) {
        var params = { DomainName: _getDomain(table), ItemName: itemId.toString(), ConsistentRead: true },
            result = {};

        _db.getAttributes(params, function(err, data) {
            if (err) {
                console.log( JSON.stringify(err) );
                error(err);
                return;
            }
            
            if (!data.Attributes.length) {
                success(null);
                return;
            }
            
            result = _parseItem(data, itemId);
            success(result);
        });
    };
    
    var _getData = function(sql, success, error) {
        var params = { SelectExpression: sql, ConsistentRead: true },
            items = [];

        _db.select(params, function(err, data) {
            if (err) {
                console.log( JSON.stringify(err) );
                error(err);
                return;
            }
            
            if (!data.Items) {
                success(items);
                return;
            }
            
            data.Items.forEach(function(item, index) {
                items[index] = _parseItem(item);
            });
            
            success(items);
        });
    };
    
    var _deleteItems = function(table, items, success, error) {
        var params = { DomainName: _getDomain(table), Items: [] },
            obj;
        
        items.forEach(function(item) {
            obj = { Name: item.id.toString() };
            params.Items.push(obj);
        });
        
        _db.batchDeleteAttributes(params, function(err, data) {
            if (err) {
                console.log( JSON.stringify(err) );
                error(err);
                return;
            }
            success();
        });
    };
    
    var _putItem = function(table, item, success, error) {
        var params = { DomainName: _getDomain(table), ItemName: item.id.toString() };

        params.Attributes = _formatItem(item);
        
        _db.putAttributes(params, function(err, data) {
            if (err) {
                console.log( JSON.stringify(err) );
                error(err);
                return;
            }
            success();
        });
    };
    
    var _putItems = function(table, items, success, error) {
        var params = { DomainName: _getDomain(table), Items: [] },
            obj;
        
        items.forEach(function(item) {
            obj = { Name: item.id.toString() };
            obj.Attributes = _formatItem(item);
            params.Items.push(obj);
        });
        
        _db.batchPutAttributes(params, function(err, data) {
            if (err) {
                console.log( JSON.stringify(err) );
                error(err);
                return;
            }
            success();
        });
    };

    function CreateSync() {
        SyncDb.apply(this, arguments);
    }
    
    CreateSync.prototype = Object.create(SyncDb.prototype);
    
    CreateSync.prototype.sendData = function(table, toInsert, toUpdate, toDelete, callback) {
        var self = this,
            toSave = toInsert.concat(toUpdate),
            total = 2, // 2 operaçoes (incluir/atualizar e excluir)
            i;

        function error(err) {
            throw err.message;
        };
        
        function progress() {
            total--;
            if (total === 0) {
                callback();
            }
        }

        if (toSave.length > 0) {
            _putItems(table, toSave, progress, error);
        } else {
            progress();
        }

        if (toDelete.length > 0) {
            _deleteItems(table, toDelete, progress, error);
        } else {
            progress();
        }
    }
    
    CreateSync.prototype.getNews = function(table, callback) {
        var user = $rootScope.user,
            groups = user.grupo || [],
            where, sql;
        
        groups = groups.map(function(item) { return item.id; });
        groups.push(user.id);
        
        where = 'where usuario in(\'' + groups.join('\',\'') + '\')',
        sql = ['select * from', _getDomain(table), where].join(' ');
        
        _getData(sql, callback, function(err) {
            throw err.message;
        });
    }
    
    CreateSync.putItem = function(table, item, success, error) {
        var cb = function() {};
        _putItem(table, item, success || cb, error || cb);
    }
    
    CreateSync.getItem = function(table, itemId, success, error) {
        var cb = function() {};
        _getItem(table, itemId, success || cb, error || cb);
    }
    
    CreateSync.registerUser = function(user, success, error) {
        _getItem('usuarios', user.id, function(item) {
            if (item) {
                success(item);
                return;
            }
            _putItem('usuarios', user, success, error);
        }, error);
    }
    
    CreateSync.updateUser = function(success, error) {
        var user = $rootScope.user,
            titular = user.titular || user.id,
            where, sql;
        
        where = "where titular = '" + titular + "' or itemName() = '" + titular + "'";
        sql = ["select * from", _getDomain("usuarios"), where].join(" ");
   
        _getData(sql, function(data) {
            user.grupo = data.filter(function(item) {
                return item.id !== user.id;
            });
            success();
        }, error);
    }
    
    return CreateSync;
});