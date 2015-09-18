/*
    Proxy Enums
    Alan Thales, 09/2015
*/
DbProxies = {
    LOCALSTORAGE: 0,
    SQLITE: 1
}

/*
    LocalStorage Proxy Class
    Autor: Alan Thales, 09/2015
*/
function LocalStorageProxy() {
    this._records = [];
}

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
    if (this._records.length === 0) {
        return [];
    }
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

LocalStorageProxy.prototype.saveAll = function(key, callback) {
//    var table = value && value.constructor === Array ? value : [value];
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
    this.saveAll(key, callback);
//    var self = this;
//    self.getRecords(key, function(table) {
//        table.push(value);
//        self.saveAll(key, table, callback);
//    });
}

LocalStorageProxy.prototype.remove = function(key, record, callback) {
    var id = typeof record === "object" ? record.id : record,
        index = this.getHashTable().indexOf(id);
    this._records.splice(index, 1);
    this.saveAll(key, callback);
}


/*
    SQLite Proxy Class
    Autor: Alan Thales, 09/2015
*/
function SQLiteProxy() { }

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

DataSet.prototype.getHashTable = function() {
    if (this.data.length === 0) {
        return [];
    }
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
//    this.getProxy().save(this.getTable(), record, callback);
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
    
    var self = this,
        toSave = self._inserteds.concat(self._updateds),
        toDelete = self._deleteds,
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
                self.getProxy().remove(self.getTable(), toDelete[i], progress);
            }
            return;
        }
        
        partial--;
    }
    
//    timer = setInterval(function() {
//        if (finished) {
//            clearInterval(timer);
//            cb();
//        }
//    }, 100);

    for (i = 0; i < toSave.length; i++) {
        self.getProxy().save(self.getTable(), toSave[i], progress);
    }
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
function DbFactory (name, proxyType) {
    this.name = name;
    var proxy;
    switch(proxyType) {
        case 0:
            proxy = new LocalStorageProxy();
            break;
        case 1:
            proxy = new SQLiteProxy();
            break;
        default:
            throw "Proxy not implemented";
    }
    this.getProxy = function() {
        return proxy;
    }
}

DbFactory.prototype.getDataSet = function(table) {
    return new DataSet(this.getProxy(), table);
}

DbFactory.prototype.select = function(sql, params, callback) {
    var proxy = this.getProxy();
    if (typeof proxy == "SQLiteProxy") {
        proxy.select(sql, params, callback);
    }
}
