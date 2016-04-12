angular.module('budget.filters', ['ionic'])

.filter('groupByMonthYear', function() {
    var dividers = {};
    
    var _setTotal = function(hasValue, dividerId, total) {
        if (hasValue && dividers[dividerId]) 
            dividers[dividerId].total = total;
    }            
    
    return function(input, monthProp, yearProp, valueProp) {
        if (!input || !input.length) return;
        
        var output = [], 
            total = 0,
            prevMonth = 0,
            prevYear = 0,
            currMonth = 0,
            currYear = 0,
            dividerId = '',
            hasValue = valueProp ? true : false;
        
        for (var i = 0, ii = input.length; i < ii && (item = input[i]); i++) {
            currMonth = item[monthProp];
            currYear = item[yearProp];
            
            if (currMonth != prevMonth || currYear != prevYear) {
                _setTotal(hasValue, dividerId, total);
                total = 0;
                
                dividerId = [currMonth, currYear].join('');

                if (!dividers[dividerId]) {
                    dividers[dividerId] = {
                        isDivider: true,
                        month: currMonth,
                        year: currYear
                    };
                }

                output.push(dividers[dividerId]);
            }
            
            output.push(item);
            
            if (hasValue)
                total += item[valueProp];
            
            prevMonth = currMonth;
            prevYear = currYear;
        }
        
        _setTotal(hasValue, dividerId, total);
        
        return output;
    };
});