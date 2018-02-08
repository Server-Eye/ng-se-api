(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCompliance', ['$q', 'SeaRequest', 'seaComplianceConfig', 'seaComplianceFix', 'seaComplianceViolation', 'seaRemotingIasHelper',
        function seaCompliance($q, SeaRequest, seaComplianceConfig, seaComplianceFix, seaComplianceViolation, helper) {
            function list(containerIds, tId, checks) {
                return seaComplianceViolation.get(containerIds, tId, checks);
            }

            return {
                list: function (containerIds, tId, checks) {
                    return list(containerIds, tId, checks);
                },

                config: seaComplianceConfig,
                fix: seaComplianceFix,
                violation: seaComplianceViolation
            };
        }]);
})();