(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaComplianceCheck', ['SeaRequest',
        function seaComplianceCheck(SeaRequest) {
            var request = new SeaRequest('compliance/check');

            function get(containerId, customerId, viewFilterId) {
                return request.get({
                    containerId: containerId,
                    customerId: customerId,
                    viewFilterId: viewFilterId
                });
            }

            return {
                get: function (containerId, customerId, viewFilterId) {
                    return get(containerId, customerId, viewFilterId);
                }
            };
        }]);
})();