(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerUsage', ['SeaRequest',
    function seaCustomerTag(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/usage?start={start}&end={end}'),
                requestDistri = new SeaRequest('customer/usage?start={start}&end={end}');

            function format(u) {
                if(u.date) {
                    u.date = new Date(u.date);
                }
                
                return u;
            }
        
            function list(start, end, cId) {
                var p,
                    tStart = start.getTime(),
                    tEnd = end.getTime();
                
                if(!cId) {
                    p = requestDistri.get({
                        start: tStart,
                        end: tEnd
                    });
                } else {
                    p = request.get({
                        cId: cId,
                        start: tStart,
                        end: tEnd
                    });
                }
                
                return p.then(function (usage) {
                    angular.forEach(usage, format);
                    
                    return usage;
                });
            }
        
            return {
                /**
                 * list the max usage of all customers or the usage graph of a specific customer
                 * @param   {Date} start of the required timespan, i.e. first of month
                 * @param   {Date} end of the required timespan, i.e. last of month
                 * @param   {String} cId empty or customerId
                 */
                list: function (start, end, cId) {
                    return list(start, end, cId);
                }
            };
    }]);
})();