(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPowerShellRepositoryUtil', ['SeaRequest', 'seaPowerShellHelper',
        function (SeaRequest, seaPowerShellHelper) {
            var parseRequest = new SeaRequest(seaPowerShellHelper.getUrl('script/parse'));
            var agentsRequest = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repoId}/script/{scriptId}/agent'));
            var settingRequest = new SeaRequest(seaPowerShellHelper.getUrl('repository/agent/setting'));

            function parseScript(script) {
                return parseRequest.post(script);
            }

            function listAgents(repositoryId, scriptId) {
                return agentsRequest.get({
                    repositoryId: repositoryId,
                    scriptId: scriptId,
                });
            }

            function updateSettings(params) {
                return settingRequest.put(params);
            }

            return {
                parseScript: function (script) {
                    return parseScript(script);
                },
                listAgents: function (repositoryId, scriptId) {
                    return listAgents(repositoryId, scriptId);
                },
                /**
                * update agent settings
                * @param {Object} params
                * @config {String} repositoryId
                * @config {String} scriptId
                * @config {String} agentId
                */
                updateSettings: function (params) {
                    return updateSettings(params);
                }

            }
        }]);
})();