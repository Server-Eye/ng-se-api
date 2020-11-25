(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerTag', ['SeaRequest',
    function seaCustomerTag(SeaRequest) {
            var request = new SeaRequest('customer/tag/{tId}');
            var requestMicroService = new SeaRequest('customer/tag/{tId}', 'v3');

            function create(params) {
                return requestMicroService.post(params);
            }

            function list() {
                return request.get();
            }

            function update(tag) {
                return requestMicroService.put(tag);
            }

            function destroy(tId) {
                return requestMicroService.del({
                    tId: tId
                });
            }

            return {
                /**
                 * create a tag
                 * @param {Object} params
                 * @config {String} [name]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function () {
                    return list();
                },

                /**
                 * update tag
                 * @param {Object} params
                 * @config {String} [tId]
                 * @config {String} [name]
                 */
                update: function (tag) {
                    return update(tag);
                },

                destroy: function (tId) {
                    return destroy(tId);
                }
            };
    }]);
})();