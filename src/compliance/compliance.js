(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCompliance', ['$q', 'SeaRequest', 'seaComplianceConfig', 'seaComplianceFix', 'seaComplianceViolation', 'seaComplianceCheck', 'seaRemotingIasHelper',
        function seaCompliance($q, SeaRequest, seaComplianceConfig, seaComplianceFix, seaComplianceViolation, seaComplianceCheck, helper) {
            return {
                config: seaComplianceConfig,
                fix: seaComplianceFix,
                violation: seaComplianceViolation,
                check: seaComplianceCheck
            };
        }]);
})();