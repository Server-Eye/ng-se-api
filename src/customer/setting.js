"use strict";

angular.module('ngSeApi').factory('seaCustomerSetting', ['SeaRequest',
  function seaCustomerSetting(SeaRequest) {
        var request = new SeaRequest('customer/{cId}/setting');

        function list(cId) {
            return request.get({
                cId: cId
            });
        }

        function update(cId, settings) {
            settings = settings || {};
            settings.cId = cId;
            return request.put(settings);
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
