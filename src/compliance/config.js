(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaComplianceConfig', ['$q', 'SeaRequest',
        function seaComplianceConfig($q, SeaRequest) {
            var request = new SeaRequest('compliance/config');

            function get(vfId) {
                return request.get({
                    vfId: vfId
                });
            }

            function update(vfId, tId, checks) {
                return request.put({
                    vfId: vfId,
                    tId: tId,
                    checks: checks,
                });
            }

            function destroy(vfId) {
                return request.del({
                    vfId: vfId
                });
            }

            function list(vfIds) {
                var loopPromises = [];
                angular.forEach(vfIds, function (vfId) {
                    var deferred = $q.defer();
                    loopPromises.push(deferred.promise);
                    
                    this.get(vfId).then((res) => {
                        deferred.resolve(res);
                    });

                });

                $q.all(loopPromises).then(function (res) {
                    console.log('#####');
                    console.log(res);
                    console.log(loopPromises);
                    console.log('#####');
                    console.log('foreach loop completed. Do something after it...');
                });
            }

            return {
                get: function (vfId) {
                    return get(vfId);
                },

                update: function (vfId, tId, checks) {
                    return update(vfId, tId, checks);
                },

                destroy: function (vfId) {
                    return destroy(vfId);
                },

                list: function (vfIds) {
                    return list(vfIds);
                },
            };
        }]);
})();