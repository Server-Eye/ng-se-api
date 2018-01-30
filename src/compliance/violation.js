(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaComplianceViolation', ['SeaRequest',
        function seaComplianceViolation(SeaRequest) {
            var request = new SeaRequest('compliance/violation');

            function get(cId, tId, checks, messageFormat) {
                return request.get({
                    cId: cId,
                    tId: tId,
                    checks: checks,
                    messageFormat: messageFormat
                });
            }

            return {
                get: function (cId, tId, checks, messageFormat) {
                    return get(cId, tId, checks, messageFormat);
                }
            };
        }]);
})();