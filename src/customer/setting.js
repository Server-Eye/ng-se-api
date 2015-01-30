"use strict";

angular.module('ngSeApi').factory('sesCustomerSetting', ['SesRequest',
  function sesCustomerSetting(SesRequest) {
        var request = new SesRequest('customer/{cId}/setting');

        function list(cId) {
            return request.get({
                cId: cId
            });
        }

        function update(cId, settings) {
            return request.put(cId, settings);
        }

        return {
            list: function (cId) {
                return list(cId);
            },

            /**
             * update customer
             * @param {String} cId
             * @param {Object} settings
             */
            update: function (cId, settings) {
                return update(cId, settings);
            }
        };
}]);
