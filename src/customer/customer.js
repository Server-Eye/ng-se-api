(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomer', ['SeaRequest', 'seaCustomerApiKey', 'seaCustomerBucket', 'seaCustomerDispatchTime', 'seaCustomerExternalCall', 'seaCustomerLocation', 'seaCustomerManager', 'seaCustomerSetting', 'seaCustomerTag', 'seaCustomerTemplate', 'seaCustomerUsage', 'seaCustomerViewFilter',
        function seaCustomer(SeaRequest, seaCustomerApiKey, seaCustomerBucket, seaCustomerDispatchTime, seaCustomerExternalCall, seaCustomerLocation, seaCustomerManager, seaCustomerSetting, seaCustomerTag, seaCustomerTemplate, seaCustomerUsage, seaCustomerViewFilter) {
            var request = new SeaRequest('customer/{cId}');

            function list() {
                return request.get();
            }

            function get(cId) {
                return request.get({
                    cId: cId
                });
            }

            function update(customer) {
                return request.put(customer);
            }

            return {
                list: function () {
                    return list();
                },

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

                apiKey: seaCustomerApiKey,
                bucket: seaCustomerBucket,
                dispatchTime: seaCustomerDispatchTime,
                externalCall: seaCustomerExternalCall,
                location: seaCustomerLocation,
                manager: seaCustomerManager,
                setting: seaCustomerSetting,
                tag: seaCustomerTag,
                template: seaCustomerTemplate,
                usage: seaCustomerUsage,
                viewFilter: seaCustomerViewFilter
            };
        }]);
})();