(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerLocation', ['SeaRequest',
        function seaCustomerLocation(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/location');

            function get(cId) {
                return request.get({
                    cId: cId
                });
            }

            function update(params) {
                return request.post(params);
            }

            return {
                /**
                 * get location
                 * @param {String} cId
                 */
                get: function (cId) {
                    return get(cId);
                },

                /**
                 * update location
                 * @param {Object} params
                 * @config {String} [cId]
                 * @config {Object} [geo]
                 * @config {Number} [geo.lat]
                 * @config {Number} [geo.lon]
                 * @config {Object} [geo.address]
                 * @config {String} [geo.address.country]
                 * @config {String} [geo.address.state]
                 * @config {String} [geo.address.postcode]
                 * @config {String} [geo.address.city]
                 * @config {String} [geo.address.road]
                 * @config {String} [geo.address.house_number]
                 */
                update: function (params) {
                    return update(params);
                }
            };
        }]);
})();