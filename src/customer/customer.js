"use strict";

angular.module('ngSeApi').factory('sesCustomer', ['SesRequest', 'sesCustomerSetting', 'sesCustomerDispatchTime',
  function sesCustomer(SesRequest, sesCustomerSetting, sesCustomerDispatchTime) {
        var request = new SesRequest('customer/{cId}');

        function get(cId) {
            return request.get({
                cId: cId
            });
        }

        function update(customer) {
            return request.put(customer);
        }

        return {
            get: function (cId) {
                return get(cId);
            },

            /**
             * update customer
             * @param {Object} customer
             * @config {String} [cId]
             * @config {String} [country]
             * @config {Number} [customerNumberIntern]
             * @config {Number} [customerNumberExtern]
             * @config {String} [companyName]
             * @config {String} [street]
             * @config {String} [zipCode]
             * @config {String} [city]
             * @config {String} [email]
             * @config {String} [phone]
             */
            update: function (customer) {
                return update(customer);
            },

            setting: sesCustomerSetting,
            dispatchTime: sesCustomerDispatchTime
        };
}]);
