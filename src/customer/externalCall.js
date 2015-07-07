(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerExternalCall', ['SeaRequest',
    function seaCustomerTag(SeaRequest) {
            var requestDistri = new SeaRequest('customer/externalCall');

            function format(ecall) {
                if(ecall.lastDate) {
                    ecall.lastDate = new Date(ecall.lastDate);
                }
                
                return ecall;
            }
        
            function list() {
                return requestDistri.get().then(function (ecalls) {
                    angular.forEach(ecalls, format);
                    
                    return ecalls;
                });
            }
        
            return {
                /**
                 * list all external url calls of your customers
                 */
                list: function () {
                    return list();
                }
            };
    }]);
})();