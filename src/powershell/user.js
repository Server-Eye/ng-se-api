(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPowerShellRepositoryUser', ['SeaRequest', 'seaPowerShellHelper',
        function (SeaRequest, seaPowerShellHelper) {
            var request = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repositoryId}/user/{userId}'));

            function add(params) {
                return request.post(params);
            }

            function update(params) {
                return request.put(params);
            }

            function remove(repositoryId, userId) {
                return request.del({
                    repositoryId: repositoryId,
                    userId: userId,
                });
            }

            return {
                /**
                 * add user
                 * @param {Object} params
                 * @config {String} repositoryId
                 * @config {String} userId
                 * @config {'ADMIN' | 'EDITOR' | 'READER'} role
                 */
                add: function (params) {
                    return add(params);
                },
                /**
                 * update user
                 * @param {Object} params
                 * @config {String} repositoryId
                 * @config {String} userId
                 * @config {'ADMIN' | 'EDITOR' | 'READER'} role
                 */
                update: function (params) {
                    return update(params);
                },
                remove: function (repositoryId, userId) {
                    return remove(repositoryId, userId);
                },
            };
        }]);
})();