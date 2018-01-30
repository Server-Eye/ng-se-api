(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCompliance', ['SeaRequest', 'seaComplianceConfig', 'seaComplianceFix', 'seaComplianceViolation', 
    function seaCompliance(SeaRequest, seaComplianceConfig, seaComplianceFix, seaComplianceViolation) {
            return {
                config: seaComplianceConfig,
                fix: seaComplianceFix,
                violation: seaComplianceViolation
            };
    }]);
})();