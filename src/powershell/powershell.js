(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPowerShellRepository', ['SeaRequest', 'seaPowerShellHelper', 'seaPowerShellRepositoryScript', 'seaPowerShellRepositoryUser', 'seaPowerShellRepositoryUtil',
        function (SeaRequest, seaPowerShellHelper, seaPowerShellRepositoryScript, seaPowerShellRepositoryUser, seaPowerShellRepositoryUtil) {
            var request = new SeaRequest(seaPowerShellHelper.getUrl('repository'));
            var requestRepository = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repositoryId}'));

            function listRepositories() {
                return request.get();
            }

            function get(repositoryId) {
                return requestRepository.get({
                    repositoryId: repositoryId,
                });
            }

            function create(params) {
                return request.post(params);
            }

            function update(params) {
                return requestRepository.put(params);
            }

            function destroy(repositoryId) {
                return requestRepository.del({
                    repositoryId: repositoryId,
                });
            }

            return {
                list: function () {
                    return listRepositories();
                },
                get: function (repositoryId) {
                    return get(repositoryId);
                },
                /**
                 * create repository
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String} [distributorId]
                 * @config {String} name
                 * @config {String} [description]
                 */
                create: function (params) {
                    return create(params);
                },
                /**
                 * update repository
                 * @param {Object} params
                 * @config {String} repositoryId
                 * @config {String} [customerId]
                 * @config {String} [distributorId]
                 * @config {String} name
                 * @config {String} [description]
                 */
                update: function (params) {
                    return update(params);
                },
                destroy: function (repositoryId) {
                    return destroy(repositoryId);
                },

                script: seaPowerShellRepositoryScript,
                user: seaPowerShellRepositoryUser,
                util: seaPowerShellRepositoryUtil,
            };
        }]);
})();