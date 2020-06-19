(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaVaultUser', ['SeaRequest', 'seaVaultHelper',
        function (SeaRequest, seaVaultHelper) {
            var request = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/user/{uId}'));

            function create(params) {
                return request.post(params);
            }

            function update(params) {
                return request.put(params);
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
                 * @config {String} vId
                 * @config {String} uId
                 * @config {String} password
                 * @config {'ADMIN' | 'EDITOR' | 'READER'} role
                 */
                create: function (params) {
                    return create(params);
                },

                /**
                 * update user
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} uId
                 * @config {String} password
                 * @config {'ADMIN' | 'EDITOR' | 'READER'} role
                 */
                update: function (params) {
                    return update(params);
                },

                destroy: function (vId, uId) {
                    return destroy(vId, uId);
                },
            };
        }]);
})();