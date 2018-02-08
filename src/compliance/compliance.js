(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCompliance', ['$q', 'SeaRequest', 'seaComplianceConfig', 'seaComplianceFix', 'seaComplianceViolation', 'seaRemotingIasHelper',
        function seaCompliance($q, SeaRequest, seaComplianceConfig, seaComplianceFix, seaComplianceViolation, helper) {
            function list(customerId, containerIds, tId, checks) {
                return new Promise((resolve, reject) => {
                    console.log('testing ' + customerId);
                    seaComplianceViolation.get(containerIds, tId, checks).then((res) => {
                        resolve(res.json);
                    }).catch((e) => {
                        console.log(e);
                        reject();
                    });
                });
            }

            return {
                list: function (customerId, containerIds, tId, checks) {
                    return list(customerId, containerIds, tId, checks);
                },

                config: seaComplianceConfig,
                fix: seaComplianceFix,
                violation: seaComplianceViolation
            };
        }]);
})();