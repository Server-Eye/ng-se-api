(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCompliance', ['$q', 'SeaRequest', 'seaComplianceConfig', 'seaComplianceFix', 'seaComplianceViolation', 'seaRemotingIasHelper',
        function seaCompliance($q, SeaRequest, seaComplianceConfig, seaComplianceFix, seaComplianceViolation, helper) {
            function list(customerId, containerIds, tId, checks) {
                return new Promise((resolve, reject) => {
                    var violationList = [];
                    var loopPromises = [];

                    angular.forEach(containerIds, function (cId) {
                        var deferred = $q.defer();
                        loopPromises.push(deferred.promise);

                        seaComplianceViolation.get(cId, tId, checks).then((res) => {
                            violationList.push(res);
                            deferred.resolve();
                        });
                    });

                    $q.all(loopPromises).then(function () {
                        resolve(violationList);
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