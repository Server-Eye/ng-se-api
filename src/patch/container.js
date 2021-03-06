(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatchContainer', ['SeaRequest', 'seaPatchHelper',
        function seaUser(SeaRequest, seaPatchHelper) {
            var request = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/container/{cId}')),
                requestAction = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/container/{cId}/{action}')),
                requestPatchJobs = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/container/{cId}/patch/{patchId}/jobs')),
                requestPatch = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/container/{cId}/patch/{patchId}'));

            function get(customerId, cId, action, queryParameters) {
                if (action) {
                    var params = {
                        customerId: customerId,
                        cId: cId,
                        action: action,
                    };

                    if (queryParameters) {
                        params = angular.extend({}, params, queryParameters);
                    }

                    return requestAction.get(params);
                }

                return request.get({
                    customerId: customerId,
                    cId: cId,
                });
            }

            function enable(customerId, cId) {
                return requestAction.post({
                    customerId: customerId,
                    cId: cId,
                    action: 'enable',
                });
            }

            function disable(customerId, cId) {
                return requestAction.post({
                    customerId: customerId,
                    cId: cId,
                    action: 'disable',
                });
            }

            function getJobsByPatchId(customerId, cId, queryParameters, patchId) {
                var params = {
                    customerId: customerId,
                    cId: cId,
                    patchId: patchId,
                };
                if (queryParameters) {
                    params = angular.extend({}, params, queryParameters);
                }
                return requestPatchJobs.get(params);
            }

            function getPatchById(customerId, cId, patchId) {
                return requestPatch.get({
                    customerId: customerId,
                    cId: cId,
                    patchId: patchId,
                });
            }

            return {
                get: function (customerId, cId) {
                    return get(customerId, cId);
                },
                enable: function (customerId, cId) {
                    return enable(customerId, cId);
                },
                disable: function (customerId, cId) {
                    return disable(customerId, cId);
                },
                category: {
                    list: function (customerId, cId) {
                        return get(customerId, cId, 'categories');
                    }
                },
                job: {
                    list: function (customerId, cId, queryParameters) {
                        return get(customerId, cId, 'jobs', queryParameters);
                    },
                    get: function(customerId, cId, patchId) {
                        return getPatchById(customerId, cId, patchId);
                    },
                    history: function (customerId, cId, queryParameters) {
                        return get(customerId, cId, 'jobs/history', queryParameters);
                    },
                },
                patch: {
                    list: function (customerId, cId, queryParameters) {
                        return get(customerId, cId, 'patches', queryParameters);
                    },
                    get: function (customerId, cId, patchId) {
                        return getPatchById(customerId, cId, patchId);
                    },
                    history: function (customerId, cId, queryParameters) {
                        return get(customerId, cId, 'patches/history', queryParameters);
                    },
                    job: {
                        list: function (customerId, cId, queryParameters, patchId) {
                            return getJobsByPatchId(customerId, cId, queryParameters, patchId);
                        },
                    },
                },
            };
        }]);
})();