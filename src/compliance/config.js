(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaComplianceConfig', ['$q', 'SeaRequest',
        function seaComplianceConfig($q, SeaRequest) {
            var request = new SeaRequest('compliance/config');

            function get(viewFilterId, customerId) {
                return request.get({
                    viewFilterId: viewFilterId,
                    customerId: customerId
                });
            }

            function update(viewFilterId, customerId, templateId, checks) {
                return request.put({
                    viewFilterId: viewFilterId,
                    customerId: customerId,
                    templateId: templateId,
                    checks: checks
                });
            }

            function destroy(viewFilterId, customerId) {
                return request.del({
                    viewFilterId: viewFilterId,
                    customerId: customerId
                });
            }

            function list(viewFilterIds, customerId) {
                var loopPromises = [];
                angular.forEach(viewFilterIds, function (viewFilterId) {
                    var deferred = $q.defer();
                    loopPromises.push(deferred.promise);
                    
                    get(viewFilterId, customerId).then(function (res) {
                        deferred.resolve(res);
                    }).catch(function (e) {
                        deferred.resolve(null);
                    });
                });

                return $q.all(loopPromises);
            }

            return {
                get: function (viewFilterId, customerId) {
                    return get(viewFilterId, customerId);
                },

                update: function (viewFilterId, customerId, templateId, checks) {
                    return update(viewFilterId, customerId, templateId, checks);
                },

                destroy: function (viewFilterId, customerId) {
                    return destroy(viewFilterId, customerId);
                },

                list: function (viewFilterIds, customerId) {
                    return list(viewFilterIds, customerId);
                },
            };
        }]);
})();