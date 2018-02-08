(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCompliance', ['SeaRequest', 'seaComplianceConfig', 'seaComplianceFix', 'seaComplianceViolation', 'seaRemotingIasHelper',
        function seaCompliance(SeaRequest, seaComplianceConfig, seaComplianceFix, seaComplianceViolation, helper) {
            function list(customerId, containerIds) {
                var violationList = [];
                var loopPromises = [];
                angular.forEach(containerIds, function (cId) {
                    var deferred = $q.defer();
                    loopPromises.push(deferred.promise);
                    
                    seaComplianceViolation.get(cId, tId, checks, messageFormat).then((res) => {
                        violationList.push(res);
                        deffered.resolve();
                    });
                });

                return $q.all(loopPromises);
            }

            return {
                list: function (customerId, containerIds) {
                    return list(customerId, containerIds);
                },

                config: seaComplianceConfig,
                fix: seaComplianceFix,
                violation: seaComplianceViolation
            };
        }]);
})();