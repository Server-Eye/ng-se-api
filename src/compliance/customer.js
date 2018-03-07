(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaComplianceCustomer', ['$q', 'SeaRequest',
        function seaComplianceCustomer($q, SeaRequest) {
            var request = new SeaRequest('compliance/config/customer');

            function get(customerIds) {
                return request.get({
                    customerId: customerIds
                });
            }

            return {
                get: function (customerIds) {
                    return get(customerIds);
                }
            };
        }]);
})();