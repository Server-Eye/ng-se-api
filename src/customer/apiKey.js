(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerApiKey', ['SeaRequest',
        function seaCustomerTag(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/apiKey/{apiKey}'),
                requestDistri = new SeaRequest('customer/apiKey/{apiKey}');
            var requestMicroService = new SeaRequest('customer/{cId}/apiKey/{apiKey}', 'v3');

            function format(apiKey) {
                if (apiKey.validUntil) {
                    apiKey.validUntil = new Date(apiKey.validUntil);
                }

                if (apiKey.createdOn) {
                    apiKey.createdOn = new Date(apiKey.createdOn);
                }

                return apiKey;
            }

            function list(cId) {
                var p;

                if (!cId) {
                    p = requestDistri.get();
                } else {
                    p = request.get({
                        cId: cId
                    });
                }

                return p.then(function (apiKeys) {
                    angular.forEach(apiKeys, format);

                    return apiKeys;
                });
            }

            function get(cId, query) {
                query = query || {};
                query.cId = cId;

                return request.get(query).then(format);
            }

            function destroy(cId, apiKey) {
                return requestMicroService.del({
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

                get: function (cId, query) {
                    return get(cId, query);
                },

                destroy: function (cId, apiKey) {
                    return destroy(cId, apiKey);
                }
            };
        }]);
})();