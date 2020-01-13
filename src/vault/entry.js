(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaVaultHelper', ['SeaRequest', 'seaVaultHelper',
        function (SeaRequest, seaVaultHelper) {
            var request = new SeaRequest(seaVaultHelper.getUrl('1/vault/vault/{vId}/entry'));
            var requestEntry = new SeaRequest(seaVaultHelper.getUrl('1/vault/vault/{vId}/entry/{eId}'));
            var requestAction = new SeaRequest(seaVaultHelper.getUrl('1/vault/vault/{vId}/entry/{eId}/{action}'));
            var requestEntries = new SeaRequest(seaVaultHelper.getUrl('1/vault/vault/{vId}/entries'));

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
                return requestEntry.del({vId, eId});
            }

            function unlock(params) {
                params = angular.extend({}, params, {action: 'unlock'});
                return requestAction.put(params);
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
            };
        }]);
})();