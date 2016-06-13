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
    
    var toNumber = function(value) {
        if ((Number(value) % 1) === 0) {
            return parseInt(value);
        } else {
            return parseFloat(value);
        }
    };
    
    var _parseItem = function(item, itemId) {
        var result = { id: itemId },
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
                } else if (!isNaN(value)) {
                    value = toNumber(value);
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
            } else {
                value = value.toString();
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
            items = [],
            itemId;

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
                itemId = isNaN(item.Name) ? item.Name : parseInt(item.Name);
                items[index] = _parseItem(item, itemId);
            });
            
            success(items);
        });
    };
    
    var _deleteAttr = function(table, itemId, attrName, success, error) {
        var params = { DomainName: _getDomain(table), ItemName: itemId.toString(), Attributes: [] },
            obj = { Name: attrName };
        
        params.Attributes.push(obj);
        
        _db.deleteAttributes(params, function(err, data) {
            if (err) {
                console.log( JSON.stringify(err) );
                error(err);
                return;
            }
            success();
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
        var domain = _getDomain(table),
            batch = {},
            i, l, obj, prop, count;

        function progress(err, data) {
            count--;
            if (err) {
                console.log( JSON.stringify(err) );
                error(err);
                return;
            }
            if (count <= 0) {
                success();
            }
        }

        l = items.length;
        
        for (i = 0; i < l; i++) {
            prop = 'lote' + (Math.floor(i / 25) + 1);
            
            obj = { Name: items[i].id.toString() };
            obj.Attributes = _formatItem(items[i]);
            
            batch[prop] = batch[prop] || { DomainName: domain, Items: [] };
            batch[prop].Items.push(obj);
        }
        
        count = Object.keys(batch).length;
        
        for (prop in batch) {
            _db.batchPutAttributes(batch[prop], progress);
        }
    };

    function CreateSync() {
        SyncDb.apply(this, arguments);
    }
    
    CreateSync.prototype = Object.create(SyncDb.prototype);
    
    CreateSync.prototype.sendData = function(table, toInsert, toUpdate, toDelete, callback) {
        var self = this,
            toSave = new ArrayMap(),
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

        if (toUpdate.length > 0) {
            toSave.putRange(toUpdate);
        }
        
        for (i = 0; i < toInsert.length; i++) {
            if (toSave.indexOfKey('id', toInsert[i].id) < 0) {
                toSave.put(toInsert[i]);
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
        sql = ['select * from', _getDomain(table), where, 'limit 2500'].join(' ');
        
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
    
    CreateSync.deleteAttr = function(table, itemId, attrName, success, error) {
        var cb = function() {};
        _deleteAttr(table, itemId, attrName, success || cb, error || cb);
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
        sql = ["select id, nome, titular from", _getDomain("usuarios"), where].join(" ");
   
        _getData(sql, function(data) {
            user.grupo = data.filter(function(item) {
                return item.id != user.id;
            });
            success();
        }, error);
    }
    
    return CreateSync;
});