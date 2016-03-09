angular.module('budget.syncSDB', ['ionic'])

.factory('SyncSDB', function() {
    var key = atob('QUtJQUlPM0NFQkdNQkNRNkVRV0E='),
        secret = atob('U1BYVlFWSkc0aEttMno2OUtrTWw4UnNtSUMxV2pyVVkxZmh3MmprTw=='),
        _db;

    AWS.config.update({ accessKeyId: key, secretAccessKey: secret });
    
    _db = new AWS.SimpleDB({ region: 'sa-east-1' });
    
    var _parseItem = function(item, itemId) {
        var result = { id: item.Name || itemId };

        item.Attributes.forEach(function(attr) {
            result[attr.Name] = attr.Value;
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
            value = item[prop] ? item[prop].toString() : '';
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
            
            result = _parseItem(data, itemId);
            
            success(result);
        });
    };
    
    var _getAll = function(table, success, error) {
        var params = { SelectExpression: ['select * from', _getDomain(table)].join(' '), ConsistentRead: true },
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
            console.log( JSON.stringify(err) );
            throw err.message;
        };
        
        function progress() {
            total--;
            if (total === 0) {
                callback();
            }
        }

        if (toSave.length > 0) {
            _putItems(table, toSave, progress);
        } else {
            progress();
        }

        if (toDelete.length > 0) {
            _deleteItems(table, toDelete, progress);
        } else {
            progress();
        }
    }
    
    CreateSync.prototype.getNews = function(table, callback) {
        _getAll(table, callback, function(err) {
            console.log( JSON.stringify(err) );
            throw err.message;
        });
    }
    
    CreateSync.prototype.putItem = function(table, item, success, error) {
        var cb = function() {};
        _putItem(table, item, success || cb, error || cb);
    }
    
    CreateSync.prototype.getItem = function(table, itemId, success, error) {
        var cb = function() {};
        _getItem(table, itemId, success || cb, error || cb);
    }
    
    return CreateSync;
});