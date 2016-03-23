angular.module('budget.filters', ['ionic'])

.filter('groupByMonthYear', function(){
    var dividers = {};
    
    var _setTotal = function(dividerId, total) {
        
        if (dividers[dividerId]) 
            dividers[dividerId].total = total;
    }

    return function(input) {
        if (!input || !input.length) return;

        var output = [], 
            total = 0,
            prevMonth = 0,
            prevYear = 0,
            currMonth = 0,
            currYear = 0,
            dividerId = '';
        
        for (var i = 0, ii = input.length; i < ii && (item = input[i]); i++) {
            currMonth = item.mes;
            currYear = item.ano;
            
            if (currMonth != prevMonth || currYear != prevYear) {
                _setTotal(dividerId, total);
                total = 0;
                
                var dividerId = [currMonth, currYear].join('');

                if (!dividers[dividerId]) {
                    dividers[dividerId] = {
                        isDivider: true,
                        month: currMonth
                    };
                }

                output.push(dividers[dividerId]);
            }            
            output.push(item);

            total += item.valor;
            prevMonth = currMonth;
            prevYear = currYear;
        }
        
        _setTotal(dividerId, total);
        
        return output;
    };
})