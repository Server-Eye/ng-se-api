(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatchContainer', ['SeaRequest', 'seaPatchHelper',
        function seaUser(SeaRequest, seaPatchHelper) {
            var request = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/container/{cId}')),
                requestAction = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/container/{cId}/{action}'));
                requestPatch = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/container/{cId}/patch/{patchId}'));

            function get(customerId, cId, action) {
                if (action) {
                    return requestAction.get({
                        customerId: customerId,
                        cId: cId,
                        action: action,
                    });
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

            function getJobsByPatchId(customerId, cId, patchId) {
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
                    list: function (customerId, cId) {
                        return get(customerId, cId, 'jobs');
                    }
                },
                patch: {
                    list: function (customerId, cId) {
                        return get(customerId, cId, 'patches');
                    },
                    job: {
                        list: function(customerId, cId, patchId) {
                            return getJobsByPatchId(customerId, cId,patchId);
                        },
                    },
                },
            };
        }]);
})();