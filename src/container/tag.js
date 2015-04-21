(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerTag', ['SeaRequest',
    function seaAgentNote(SeaRequest) {
            var request = new SeaRequest('container/{cId}/tag/{tId}');

            function create(params) {
                return request.post(params);
            }

            function list(cId) {
                return request.get({
                    cId: cId
                });
            }

            function destroy(cId, tId) {
                return request.del({
                    cId: cId,
                    tId: tId
                });
            }

            return {
                /**
                 * add tag to container
                 * @param {Object} params
                 * @config {String} [cId]
                 * @config {String} [tId]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function (cId) {
                    return list(cId);
                },

                destroy: function (cId, tId) {
                    return destroy(cId, tId);
                }
            };
    }]);
})();