(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCompliance', ['SeaRequest', 'seaComplianceConfig', 'seaComplianceFix', 'seaComplianceViolation', 'seaRemotingIasHelper',
        function seaCompliance(SeaRequest, seaComplianceConfig, seaComplianceFix, seaComplianceViolation, helper) {
            function list(customerId, containerIds) {
                console.log('##########################');
                console.log('custoemrId '+customerId);
                console.log('containerIds ');
                console.log(containerIds);
                console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%');
                var query = helper.getContainerIds(containerIds);
                query.section = 'container';
                query.action = 'get';
                console.log(query);
                console.log('##########################');
                return true;
                //return request.post(query);
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