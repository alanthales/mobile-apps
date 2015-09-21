/*
    Proxy Enums
    Alan Thales, 09/2015
*/
DbProxies = {
    LOCALSTORAGE: 0,
    SQLITE: 1
}

function DbProxy() {
    this._records = [];
    this.createDatabase = function() {}
}



/*
    LocalStorage Proxy Class
    Autor: Alan Thales, 09/2015
*/
LocalStorageProxy.prototype = new DbProxy();
LocalStorageProxy.prototype.constructor = LocalStorageProxy;
//LocalStorageProxy.prototype.parent = DbProxy.prototype;

function LocalStorageProxy() {}

LocalStorageProxy.prototype.getRecords = function(options, callback) {
    var opts = typeof options === 'object' ? options : { key: options },
        table = window.localStorage[opts.key],
        results = [];
    if (table) {
        results = JSON.parse(table);
    }
    callback( results );
    this._records = results;
}

LocalStorageProxy.prototype.getHashTable = function() {
//    if (this._records.length === 0) {
//        return [];
//    }
    return this._records.map(function(record) {
        return record.id;
    });
}

LocalStorageProxy.prototype.select = function(key, opts, callback) {
    this.getRecords(key, function(table) {
        var opts = opts && typeof opts === "object" ? opts : { id: opts },
            result = [],
            finded = false,
            record, i, props;

        for (i = 0; i < table.length; i++) {
            record = table[i];
            for (props in opts) {
                if (record[props] != opts[props]) {
                    finded = false;
                    break;
                } else {
                    finded = true;
                }
            }
            if (finded) {
                result.push(record);
            }
        }

        callback( result );
    });
}

LocalStorageProxy.prototype._saveAll = function(key, callback) {
    window.localStorage[key] = JSON.stringify(this._records);
    if (typeof callback == "function") {
        callback();
    }
}

LocalStorageProxy.prototype.save = function(key, record, callback) {
    var index = this.getHashTable().indexOf(record.id);
    if (index === -1) {
        this._records.push(record);
    } else {
        this._records.splice(index, 1, record);
    }
    this._saveAll(key, callback);
}

LocalStorageProxy.prototype.remove = function(key, record, callback) {
    var id = typeof record === "object" ? record.id : record,
        index = this.getHashTable().indexOf(id);
    this._records.splice(index, 1);
    this._saveAll(key, callback);
}

LocalStorageProxy.prototype.commit = function(key, toInsert, toUpdate, toDelete, callback) {
    var self = this,
        toSave = toInsert.concat(toUpdate),
        total = toSave.length + toDelete.length,
        partial = toSave.length,
        cb = callback && typeof callback === "function" ? callback : function() {},
        i;

    function progress() {
        total--;
        
        if (total === 0) {
            cb();
            return;
        }
        
        if (partial === 0) {
            for (i = 0; i < toDelete.length; i++) {
                self.remove(key, toDelete[i], progress);
            }
            return;
        }
        
        partial--;
    }
    
    for (i = 0; i < toSave.length; i++) {
        self.save(key, toSave[i], progress);
    }
}



/*
    SQLite Proxy Class
    Autor: Alan Thales, 09/2015
*/
SQLiteProxy.prototype = new DbProxy();
SQLiteProxy.prototype.constructor = SQLiteProxy;

function SQLiteProxy(dbName) {
    var db;
    
    if (window.cordova && window.sqlitePlugin) {
        db = window.sqlitePlugin.openDatabase({name: dbName});
    } else {
        db = window.openDatabase(dbName, "SQLite Database", "1.0", 5*1024*1024);
    }
    
    this._records = [];
    this._maps = [];
    
    this.getDb = function() {
        return db;
    }
}

SQLiteProxy.prototype.createDatabase = function(maps, callback) {
    this.getDb().transaction(function(tx) {
        var cb = callback && typeof callback === "function" ? callback : function() {},
            total = maps.length,
            fields = "",
            field, table, sql, i, j;
        
        function done() {
            total--;
            if (total === 0) {
                cb();
            }
        }
        
        for (i = 0; i < maps.length; i++) {
            table = maps[i].table;

            for (j = 0; j < maps[i].fields.length; j++) {
                field = maps[i].fields[j];
                fields += [
                    field.name, field.type, (field.nullable ? "" : "NOT NULL"), (field.primary ? "PRIMARY KEY" : ""), ","
                ].join(" ");
            }
            
            fields = fields.substr(0, fields.length -1);
            sql = ["CREATE TABLE IF NOT EXISTS", table, "(", fields, ")"].join(" ");
            
            tx.executeSql(sql, [], done);
        }
    });
}

SQLiteProxy.prototype.getRecords = function(options, callback) {
    var opts = typeof options === "object" ? options : { key: options, limit: 1000 };
    
    this.getDb().transaction(function(tx) {
        var sql = ["SELECT * FROM", opts.key, "LIMIT", opts.limit].join(" "),
            table = [],
            i;
        tx.executeSql(sql, [], function(tx, results) {
            for (i = 0; i < results.rows.length; i++) {
                table.push(results.rows.item(i));
            }
            if (typeof callback === "function") {
                callback( table );
            }
            this._records = table;
        })
    });
}

SQLiteProxy.prototype.getHashTable = function() {
    return this._records.map(function(record) {
        return record.id;
    });
}

SQLiteProxy.prototype.insert = function(key, record, transaction, callback) {
    var params = [],
        fields = "",
        values = "",
        sql, prop;

    for (prop in record) {
        params.push(record[prop]);
        fields += prop + ",";
        values += "?,";
    }

    fields = fields.substr(0, fields.length -1);
    values = values.substr(0, values.length -1);

    sql = [
        "INSERT INTO", key, "(", fields, ") VALUES (", values, ")"
    ].join(" ");
    
    this._records.push(record);
    
    transaction.executeSql(sql, params, callback);
}

SQLiteProxy.prototype.update = function(key, record, transaction, callback) {
    var params = [],
        where = "id = " + record.id,
        sets = "",
        sql, prop;
        
    for (prop in record) {
        if (prop != "id") {
            params.push(record[prop]);
            sets += prop + " = ?,"
        }
    }

    sets = sets.substr(0, sets.length -1);

    sql = [
        "UPDATE", key, "set", sets, "WHERE", where
    ].join(" ");
    
    this._records.splice(index, 1, record);
    
    transaction.executeSql(sql, params, callback);
}

SQLiteProxy.prototype.delete = function(key, record, transaction, callback) {
    var id = typeof record === "object" ? record.id : record,
        index = this.getHashTable().indexOf(id),
        where = "id = " + id,
        sql;
    
    sql = ["DELETE FROM", key, "WHERE", where].join(" ");
    
    this._records.splice(index, 1);
    
    transaction.executeSql(sql, [], callback);
}

SQLiteProxy.prototype.commit = function(key, toInsert, toUpdate, toDelete, callback) {
    var self = this,
        total = toInsert.length + toUpdate.length + toDelete.length,
        cb = callback && typeof callback === "function" ? callback : function() {},
        i;

    function progress() {
        total--;
        if (total === 0) {
            cb();
            return;
        }
    }

    self.getDb().transaction(function(tx) {
        // to insert
        for (i = 0; i < toInsert.length; i++) {
            self.insert(key, toInsert[i], tx, progress);
        }
        // to update
        for (i = 0; i < toUpdate.length; i++) {
            self.update(key, toUpdate[i], tx, progress);
        }
        // to delete
        for (i = 0; i < toDelete.length; i++) {
            self.delete(key, toDelete[i], tx, progress);
        }
    });
}



/*
    DataSet Class
    Autor: Alan Thales, 09/2015
*/
function DataSet(proxy, table) {
    var prx = proxy,
        tbl = table;
    
    this._inserteds = [];
    this._deleteds = [];
    this._updateds = [];
    
    this.active = false;
    this.data = [];
    this.limit = 1000;
    
    this.getProxy = function() {
        return prx;
    }
    
    this.getTable = function() {
        return tbl;
    }
}

DataSet.prototype.open = function(callback) {
    var self = this,
        opts = { key: this.getTable(), limit: this.limit };
    
    function fn(results, cb) {
        if (typeof cb === "function") {
            cb(results);
        }
    }
    
    if (self.active) {
        fn(self.data, callback);
        return;
    }
    
    self.getProxy().getRecords(opts, function(table) {
        self.data = table;
        self.active = true;
        fn(table, callback);
    });
}

DataSet.prototype.close = function() {
    this.active = false;
    this.data.length = 0;
    this._inserteds.length = 0;
    this._updateds.length = 0;
    this._deleteds.length = 0;
}

DataSet.prototype.getHashTable = function() {
//    if (this.data.length === 0) {
//        return [];
//    }
    return this.data.map(function(record) {
        return record.id;
    });
}

DataSet.prototype.insert = function(record) {
    if (!this.active) {
        throw "Invalid operation on closed dataset";
    }
    if (record && !record.id) {
        record.id = (new Date()).getTime();
    }
    var hashtable = this.getHashTable();
        index = hashtable.indexOf(record.id);
    if (index === -1) {
        this._inserteds.push(record);
        this.data.push(record);
    }
}

DataSet.prototype.update = function(record) {
    if (!this.active) {
        throw "Invalid operation on closed dataset";
    }
    var hashtable = this.getHashTable();
        index = hashtable.indexOf(record.id);
    if (!this._updateds[index]) {
        this._updateds.push(record);
    } else {
        this._updateds.splice(index, 1, record);
    }
    this.data.splice(index, 1, record);
}

DataSet.prototype.delete = function(record) {
    if (!this.active) {
        throw "Invalid operation on closed dataset";
    }
    var hashtable = this.getHashTable();
        index = hashtable.indexOf(record.id);
    if (!this._deleteds[index]) {
        this._deleteds.push(record);
    }
    this.data.splice(index, 1);
}

DataSet.prototype.post = function(callback) {
    if (!this.active) {
        throw "Invalid operation on closed dataset";
    }
    this.getProxy().commit(
        this.getTable(), this._inserteds, this._updateds,
        this._deleteds, callback);
}

DataSet.prototype.filter = function(options) {
    return this.data.filter(function(record) {
        var finded = true,
            prop;
        for (prop in options) {
            if (record[prop] != options[prop]) {
                finded = false;
                break;
            }
        }
        return finded;
    });
}



/*
    Database Factory Utility Class
    Alan Thales, 09/2015
*/
function DbFactory (opts, proxyType) {
    var proxy;
    switch(proxyType) {
        case 0:
            proxy = new LocalStorageProxy();
            break;
        case 1:
            proxy = new SQLiteProxy(opts);
            break;
        default:
            throw "Proxy not implemented";
    }
    this.opts = opts;
    this.getProxy = function() {
        return proxy;
    }
}

DbFactory.prototype.initializeDb = function(maps, callback) {
    this.getProxy().createDatabase(maps, callback);
}

DbFactory.prototype.createDataSet = function(table) {
    return new DataSet(this.getProxy(), table);
}

DbFactory.prototype.select = function(sql, params, callback) {
    this.getProxy().select(sql, params, callback);
}
