(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaVault', ['SeaRequest', 'seaVaultHelper', 'seaVaultEntry', 'seaVaultUser',
        function (SeaRequest, seaVaultHelper, seaVaultEntry, seaVaultUser) {
            var requestVault = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}'));
            var requestAction = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/{action}'));
            var requestVaults = new SeaRequest(seaVaultHelper.getUrl('vault'));

            function listVaults(queryParams) {
                return requestVaults.get(queryParams);
            }

            function create(params) {
                return request.post(params);
            }
            
            function update(params) {
                return requestVault.put(params);
            }

            function get(vId) {
                return requestVault.get({
                    vId: vId,
                });
            }

            function destroy(vId) {
                return requestVault.del({
                    vId: vId
                });
            }
            
            function restore(params) {
                params = angular.extend({}, params, {action: 'restore'});
                return requestAction.post(params);
            }
           
            function unlock(params) {
                params = angular.extend({}, params, {action: 'unlock'});
                return requestAction.put(params);
            }

            return {
                list: function (queryParams) {
                    return listVaults(queryParams);
                },

                /**
                 * create vault
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String} [distributorId]
                 * @config {String} [userId]
                 * @config {Boolean} showPassword
                 * @config {String} authenticationMethod
                 * @config {String} name
                 * @config {String} description
                 * @config {String} password
                 */
                create: function (params) {
                    return create(params);
                },

                get: function (vId) {
                    return get(vId);
                },
                
                /**
                 * update vault
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} [customerId]
                 * @config {String} [distributorId]
                 * @config {String} [userId]
                 * @config {Boolean} [showPassword]
                 * @config {String} [authenticationMethod]
                 * @config {String} [name]
                 * @config {String} [description]
                 * @config {String} password
                 */
                update: function (params) {
                    return update(params);
                },

                destroy: function (vId) {
                    return destroy(vId);
                },
                
                /**
                 * restore vault
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} restoreKey
                 */
                restore: function (params) {
                    return restore(params);
                },
                
                /**
                 * unlock vault
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} [password]
                 * @config {String} [privateKey]
                 */
                unlock: function (params) {
                    return unlock(params);
                },
                entry: seaVaultEntry,
                user: seaVaultUser,
            };
        }]);
})();