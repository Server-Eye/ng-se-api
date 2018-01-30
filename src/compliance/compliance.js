(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCompliance', ['SeaRequest', 'SeaComplianceConfig', 'SeaComplianceFix', 'SeaComplianceViolation', 
    function seaCompliance(SeaRequest, SeaComplianceConfig, SeaComplianceFix, SeaComplianceViolation) {
            return {
                config: seaComplianceConfig,
                fix: seaComplianceFix,
                violation: seaComplianceViolation
            };
    }]);
})();