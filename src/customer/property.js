(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerProperty', ['SeaRequest',
    function seaCustomerSetting(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/property/{key}');

            function list(cId) {
                return request.get({
                    cId: cId
                });
            }

            function create(cId, key, value) {
                return request.post({
                    cId: cId,
                    key: key,
                    value: value
                });
            }

            function destroy(cId, key) {
                return request.del({
                    cId: cId,
                    key: key
                });
            }

            return {
                list: function (cId) {
                    return list(cId);
                },

                /**
                 * add customer property
                 * @param {String} cId
                 * @param {String} key
                 * @param {String} value
                 */
                create: function (cId, key, value) {
                    return create(cId, key, value);
                },

                destroy: function (cId, key) {
                    return destroy(cId, key);
                }
            };
    }]);
})();