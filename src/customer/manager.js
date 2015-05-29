(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerManager', ['SeaRequest',
    function seaCustomerTag(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/manager/{uId}');

            function list(cId) {
                return request.get(cId);
            }

            function addUser(cId, email) {
                return request.put({
                    cId: cId,
                    uId: email
                });
            }

            function removeUser(cId, uId) {
                return request.del({
                    cId: cId,
                    uId: uId
                });
            }

            return {
                list: function (cId) {
                    return list(cId);
                },

                /**
                 * add user as manager
                 * @param {Object} params
                 * @config {String} [cId]
                 * @config {String} [email] email address of the user
                 */
                add: function (cId, email) {
                    return addUser(cId, email);
                },

                remove: function (cId, uId) {
                    return removeUser(cId, uId);
                }
            };
    }]);
})();