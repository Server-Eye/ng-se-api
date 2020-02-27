(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaVaultUser', ['SeaRequest', 'seaVaultHelper',
        function (SeaRequest, seaVaultHelper) {
            var request = new SeaRequest(seaVaultHelper.getUrl('/vault/{vId}/user/{uId}'));

            function create(params) {
                return request.post(params);
            }

            function destroy(vId, uId) {
                return request.del({
                    vId: vId,
                    uId: uId,
                });
            }

            return {
                /**
                 * grant user access to a vault
                 * @param {Object} params
                 * @config {String} vaultId
                 * @config {String} userId
                 * @config {String} password
                 */
                create: function (params) {
                    return create(params);
                },
                
                destroy: function (vId, uId) {
                    return destroy(vId, uId);
                },
            };
        }]);
})();