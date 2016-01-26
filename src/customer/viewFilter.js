(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerViewFilter', ['SeaRequest',
    function seaCustomerDispatchTime(SeaRequest) {
            var request = new SeaRequest('customer/viewFilter/{vfId}');

            function create(params) {
                return request.post(params);
            }

            function list() {
                return request.get();
            }

            function update(viewFilter) {
                return request.put(viewFilter);
            }

            function destroy(vfId) {
                return request.del({
                    vfId: vfId
                });
            }

            return {
                /**
                 * create viewFilter
                 * @param {Object} params
                 * @config {String} [name]
                 * @config {Object} [query]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function () {
                    return list();
                },

                /**
                 * update viewFilter
                 * @param {Object} params
                 * @config {String} [vfId]
                 * @config {String} [name]
                 * @config {Object} [query]
                 */
                update: function (viewFilter) {
                    return update(viewFilter);
                },

                destroy: function (vfId) {
                    return destroy(vfId);
                }
            };
    }]);
})();