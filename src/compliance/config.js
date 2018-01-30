(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaComplianceConfig', ['SeaRequest',
        function seaComplianceConfig(SeaRequest) {
            var request = new SeaRequest('compliance/config');

            function get(vfId) {
                return request.get({
                    vfId: vfId
                });
            }

            function update(vfId, tId, checks) {
                return request.put({
                    vfId: vfId,
                    tId: tId,
                    checks: checks,
                });
            }

            function destroy(vfId) {
                return request.del({
                    vfId: vfId
                });
            }

            return {
                get: function (vfId) {
                    return get(vfId);
                },

                update: function (vfId, tId, checks) {
                    return update(vfId, tId, checks);
                },

                destroy: function (vfId) {
                    return destroy(vfId);
                },
            };
        }]);
})();