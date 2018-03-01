(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaComplianceViolation', ['SeaRequest',
        function seaComplianceViolation(SeaRequest) {
            var request = new SeaRequest('compliance/violation');

            function get(containerId, customerId, viewFilterId, messageFormat) {
                return request.get({
                    containerId: containerId,
                    customerId: customerId,
                    viewFilterId: viewFilterId,
                    messageFormat: messageFormat
                });
            }

            return {
                get: function (containerId, customerId, viewFilterId, messageFormat) {
                    return get(containerId, customerId, viewFilterId, messageFormat);
                }
            };
        }]);
})();