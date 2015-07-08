(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerUsage', ['SeaRequest',
    function seaCustomerTag(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/usage'),
                requestDistri = new SeaRequest('customer/usage');

            function format(u) {
                if (u.date) {
                    u.date = new Date(u.date);
                }

                return u;
            }

            function list(year, month, cId) {
                var params = {
                    year: year,
                    month: month
                };

                if (cId) {
                    params.cId = cId;

                }

                return requestDistri.get(params).then(function (usage) {
                    angular.forEach(usage, format);

                    return usage;
                });
            }

            return {
                /**
                 * list the max usage of all customers or the usage graph of a specific customer
                 * @param   {Date} year of the required usage
                 * @param   {Date} month of the required usage
                 * @param   {String} cId empty or customerId
                 */
                list: function (year, month, cId) {
                    return list(year, month, cId);
                }
            };
    }]);
})();