(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPowerShellRepositoryUtil', ['SeaRequest', 'seaPowerShellHelper',
        function (SeaRequest, seaPowerShellHelper) {
            var parseRequest = new SeaRequest(seaPowerShellHelper.getUrl('script/parse'));
            var agentsRequest = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repositoryId}/script/{scriptId}/agent'));
            var settingRequest = new SeaRequest(seaPowerShellHelper.getUrl('repository/agent/setting'));
            var agentScriptRequest = new SeaRequest(seaPowerShellHelper.getUrl('repository/script/agent/{agentId}'));
            var taskScriptRequest = new SeaRequest(seaPowerShellHelper.getUrl('repository/script/scheduled/task/{taskId}'));
            var tasksRequest = new SeaRequest(seaPowerShellHelper.getUrl('repository/{powerShellRepositoryId}/script/{powerShellRepositoryScriptId}/scheduled-task'));

            function parseScript(script) {
                return parseRequest.post(script);
            }

            function listAgents(repositoryId, scriptId) {
                return agentsRequest.get({
                    repositoryId: repositoryId,
                    scriptId: scriptId,
                });
            }
            
            function listTasks(repositoryId, scriptId) {
                return tasksRequest.get({
                    powerShellRepositoryId: repositoryId,
                    powerShellRepositoryScriptId: scriptId,
                });
            }

            function getScriptByAgent(agentId) {
                return agentScriptRequest.get({
                    agentId: agentId,
                });
            }

            function updateSettings(params) {
                return settingRequest.put({
                    powerShellRepositoryId: params.repositoryId,
                    powerShellRepositoryScriptId: params.scriptId,
                    agentId: params.agentId,
                });
            }

            function getScriptByTaskId(taskId) {
                return taskScriptRequest.get({
                    taskId: taskId,
                });
            }

            return {
                parseScript: function (script) {
                    return parseScript(script);
                },
                listAgents: function (repositoryId, scriptId) {
                    return listAgents(repositoryId, scriptId);
                },
                listTasks: function (repositoryId, scriptId) {
                    return listTasks(repositoryId, scriptId);
                },
                getScriptByAgent: function (agentId) {
                    return getScriptByAgent(agentId);
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
                },
                getScriptByTaskId: function (taskId) {
                    return getScriptByTaskId(taskId);
                },
            }
        }]);
})();