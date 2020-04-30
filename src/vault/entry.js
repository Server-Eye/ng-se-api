(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaVaultEntry', ['SeaRequest', 'seaVaultHelper',
        function (SeaRequest, seaVaultHelper) {
            var request = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/entry'));
            var requestEntry = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/entry/{eId}'));
            var requestAction = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/entry/{eId}/{action}'));
            var requestEntries = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/entries'));
            var requestAgentSetting = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/entry/{eId}/agent/{aId}/setting/{key}'));

            function listEntries(vId) {
                return requestEntries.get({
                    vId: vId,
                });
            }

            function create(params) {
                return request.post(params);
            }

            function get(vId, eId) {
                return requestEntry.get(vId, eId);
            }

            function update(params) {
                return requestEntry.put(params);
            }

            function destroy(vId, eId) {
                return requestEntry.del({ vId, eId });
            }

            function unlock(params) {
                params = angular.extend({}, params, { action: 'unlock' });
                return requestAction.put(params);
            }

            function updateAgentSetting(params) {
                return requestAgentSetting.put(params);
            }


            return {
                list: function (vId) {
                    return listEntries(vId);
                },

                /**
                 * create entry
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} name
                 * @config {String} description
                 * @config {String} [password]
                 * @config {String} [privateKey]
                 * @config {Object} credentials 
                 */
                create: function (params) {
                    return create(params);
                },
                get: function (vId, eId) {
                    return get(vId, eId);
                },

                /**
                 * update entry
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} eId
                 * @config {String} name
                 * @config {String} description
                 * @config {String} [password]
                 * @config {String} [privateKey]
                 * @config {Object} credentials 
                 */
                update: function (params) {
                    return update(params);
                },
                destroy: function (vId, eId) {
                    return destroy(vId, eId);
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
                agent: {
                    setting: {
                        /**
                        * update agent settings with vault entries
                        * @param {Object} params
                        * @config {String} vId   vaultId
                        * @config {String} eId   entryId
                        * @config {String} aId   agentId
                        * @config {String} key   agent setting key
                        * @config {String} [password]
                        * @config {String} [privateKey]
                        */

                        update: function (params) {
                            return updateAgentSetting(params);
                        }
                    }
                },
            };
        }]);
})();