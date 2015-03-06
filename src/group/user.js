(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaGroupUser', ['SeaRequest',
    function seaGroupUser(SeaRequest) {
            var request = new SeaRequest('group/{gId}/user/{uId}');

            function list(gId) {
                return request.get({
                    gId: gId
                });
            }

            function addUser(gId, uId) {
                return request.put({
                    uId: uId,
                    gId: gId
                });
            }

            function removeUser(gId, uId) {
                return request.del({
                    uId: uId,
                    gId: gId
                });
            }

            return {
                list: function (gId) {
                    return list(gId);
                },

                /**
                 * add user to group
                 * @param {String} gId
                 * @param {String} uId
                 */
                add: function (gId, uId) {
                    return addUser(gId, uId);
                },

                /**
                 * remove user to group
                 * @param {String} gId
                 * @param {String} uId
                 */
                remove: function (gId, uId) {
                    return removeUser(gId, uId);
                }
            };
    }]);
})();