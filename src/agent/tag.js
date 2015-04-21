(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentTag', ['SeaRequest',
    function seaAgentNote(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/tag/{tId}');

            function create(params) {
                return request.post(params);
            }

            function list(aId) {
                return request.get({
                    aId: aId
                });
            }

            function destroy(aId, tId) {
                return request.del({
                    aId: aId,
                    tId: tId
                });
            }

            return {
                /**
                 * add tag to agent
                 * @param {Object} params
                 * @config {String} [aId]
                 * @config {String} [tId]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function (aId) {
                    return list(aId);
                },

                destroy: function (aId, tId) {
                    return destroy(aId, tId);
                }
            };
    }]);
})();