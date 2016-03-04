angular.module('budget.syncSDB', ['ionic'])

.factory('SyncSDB', function() {
    var _db = new AWS.SimpleDB({ region: 'sa-east-1' });
    
    var _parseItem = function(item) {
        var result = { id: item.Name };
        
        item.Attributes.forEach(function(attr) {
            result[attr.Name] = attr.Value;
        });
        
        return result;
    };
    
    var _getDomain = function(table) {
        return ['budget_', table].join('');
    };
    
    var _getAll = function(table, callback) {
        var params = { SelectExpression: ['select * from', _getDomain(table)].join(' '), ConsistentRead: true },
            items = [];

        _db.select(params, function(err, data) {
            console.log('select', data);
            if (err) {
                throw err.stack;
                return;
            }
            
            if (!data.Items) {
                callback(items);
                return;
            }
            
            data.Items.forEach(function(item, index) {
                items[index] = _parseItem(item);
            });
            
            callback(items);
        });
    };
    
    var _putItems = function(table, items, callback) {
        var params = { DomainName: _getDomain(table), Items: [] },
            obj, prop;
        
        items.forEach(function(item) {
            obj = { Attributes: [], Name: item.id.toString() };
            for (prop in item) {
                if (prop === 'id') {
                    continue;
                }
                obj.Attributes.push({
                    Name: prop, Value: item[prop], Replace: true
                });
            }
            params.Items.push(obj);
        });
        
        _db.batchPutAttributes(params, function(err, data) {
            if (err) {
                throw err.stack;
                return;
            }
            console.log('batchPutAttributes', data);
            callback();
        });
    };

    function CreateSync() {
        SyncDb.apply(this, arguments);
    }
    
    CreateSync.prototype = Object.create(SyncDb.prototype);
    
    CreateSync.prototype.sendData = function(table, toInsert, toUpdate, toDelete, callback) {
        var self = this,
            toSave = toInsert.concat(toUpdate),
            total = toSave.length + toDelete.length,
            cb = callback && typeof callback === "function" ? callback : function() {},
            i;

        function progress() {
            total--;
            if (total === 0) {
                cb();
            }
        }

        for (i = 0; i < toSave.length; i++) {
            _putItems(table, toSave, progress);
        }

        for (i = 0; i < toDelete.length; i++) {
//            self.remove(key, toDelete[i], progress);
        }
    }
    
    CreateSync.prototype.getNews = function(table, callback) {
        _getAll(table, callback);
    }
    
    return CreateSync;
});