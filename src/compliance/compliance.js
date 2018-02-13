(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCompliance', ['$q', 'SeaRequest', 'seaComplianceConfig', 'seaComplianceFix', 'seaComplianceViolation', 'seaRemotingIasHelper',
        function seaCompliance($q, SeaRequest, seaComplianceConfig, seaComplianceFix, seaComplianceViolation, helper) {
            function list(containerIds, tId, checks, messageFormat) {
                return seaComplianceViolation.get(containerIds, tId, checks, messageFormat);
            }

            return {
                list: function (containerIds, tId, checks, messageFormat) {
                    return list(containerIds, tId, checks, messageFormat);
                },

                config: seaComplianceConfig,
                fix: seaComplianceFix,
                violation: seaComplianceViolation
            };
        }]);
})();