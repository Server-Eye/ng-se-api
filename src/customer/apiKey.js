(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerApiKey', ['SeaRequest',
    function seaCustomerTag(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/apiKey/{apiKey}'),
                requestDistri = new SeaRequest('customer/apiKey/{apiKey}');

            function list(cId) {
                if(!cId) {
                    return requestDistri.get();
                }
                
                return request.get({
                    cId: cId
                });
            }
        
            function get(cId, apiKey) {
                return request.get({
                    cId: cId,
                    apiKey: apiKey
                });
            }

            function destroy(cId, apiKey) {
                return request.del({
                    cId: cId,
                    apiKey: apiKey
                });
            }

            return {
                /**
                 * list all api keys of a customer or all your customers
                 * @param   {String} cId empty or customerId
                 */
                list: function (cId) {
                    return list(cId);
                },
                
                get: function (cId, apiKey) {
                    return get(cId, apiKey);
                },

                destroy: function (cId, apiKey) {
                    return destroy(cId, apiKey);
                }
            };
    }]);
})();