angular.module('budget.simpleDB', ['ionic'])

.factory('simpleDB', ['daoFactory', function() {
    var db = new AWS.SimpleDB({ region: 'sa-east-1' }),
        domain = 'budget';
    
    return {
        getTable: function(table, callback) {
            var params = { DomainName: domain, ItemName: table, ConsistentRead: true };
            
            db.getAttributes(params, function(err, data) {
                if (!err) {
                    callback(data);
                    return;
                }
            });
        }
    }
}]);