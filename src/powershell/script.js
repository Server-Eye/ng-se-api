(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPowerShellRepositoryScript', ['SeaRequest', 'seaPowerShellHelper',
        function (SeaRequest, seaPowerShellHelper) {
            var request = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repositoryId}/script'));
            var requestScripts = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repositoryId}/scripts'));
            var requestScript = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repositoryId}/script/{scriptId}'));

            function listScripts() {
                return requestScripts.get();
            }

            function get(repositoryId, scriptId) {
                return requestScript.get({
                    repositoryId: repositoryId,
                    scriptId: scriptId,
                });
            }

            function create(params) {
                return request.post(params);
            }

            function update(params) {
                return requestScript.put(params);
            }

            function destroy(repositoryId, scriptId) {
                return requestScript.del({
                    repositoryId: repositoryId,
                    scriptId: scriptId,
                });
            }

            return {
                list: function () {
                    return listScripts();
                },
                get: function (repositoryId, scriptId) {
                    return get(repositoryId, scriptId);
                },
                /**
                 * create script
                 * @param {Object} params
                 * @config {String} repositoryId
                 * @config {String} name
                 * @config {String} [description]
                 * @config {String} script
                 */
                create: function (params) {
                    return create(params);
                },
                /**
                 * update script
                 * @param {Object} params
                 * @config {String} repositoryId
                 * @config {String} scriptId
                 * @config {String} name
                 * @config {String} [description]
                 * @config {String} script
                 */
                update: function (params) {
                    return update(params);
                },
                destroy: function (repositoryId, scriptId) {
                    return destroy(repositoryId, scriptId);
                },
            };
        }]);
})();