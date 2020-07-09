(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaVaultUtil', ['SeaRequest', 'seaVaultHelper',
        function (SeaRequest, seaVaultHelper) {

            var agentsRequest = new SeaRequest(seaVaultHelper.getUrl('vault/{vaultId}/entry/{entryId}/key/{credentialKey}/agent/'));
            var settingRequest = new SeaRequest(seaVaultHelper.getUrl('vault/{vaultId}/entry/{entryId}/agent/{agentId}/setting/{credentialKey}'));

            function listAgents(vId, eId, key) {
                return agentsRequest.get({
                    vaultId: vId,
                    entryId: eId,
                    credentialKey: key,
                });
            }

            function updateSettings(params) {
                return settingRequest.put({
                    vaultId: params.vId,
                    entryId: params.eId,
                    agentId: params.aId,
                    credentialKey: params.key,
                });
            }

            return {
                listAgents: function (vId, eId, key) {
                    return listAgents(vId, eId, key);
                },
                /**
                * update agent settings with vault entries
                * @param {Object} params
                * @config {String} vId   vaultId
                * @config {String} eId   entryId
                * @config {String} aId   agentId
                * @config {String} key   agent setting key
                * @config {String} [password]
                * @config {String} [privateKey]
                * @config {String} [token]
                */
                updateSettings: function (params) {
                    return updateSettings(params);
                },

            }
        }]);
})();