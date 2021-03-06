(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatchViewFilter', ['SeaRequest', 'seaPatchHelper',
        function seaUser(SeaRequest, seaPatchHelper) {
            var request = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/viewFilters')),
                requestVf = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/viewFilter/{vfId}/{action}')),
                requestPost = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/viewFilter')),
                requestDel = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/viewFilter/{vfId}'));

            function get(customerId, vfId, action, queryParameters) {
                if (vfId) {
                    var params = {
                        customerId: customerId,
                        vfId: vfId,
                        action: action,
                    };

                    if (queryParameters) {
                        params = angular.extend({}, params, queryParameters);
                    }

                    return requestVf.get(params);
                }

                return request.get({
                    customerId: customerId,
                });
            }

            function post(customerId, vfId, body, action) {
                if (vfId) {
                    var params = angular.extend({}, { customerId: customerId, vfId: vfId, action: action }, body);
                    return requestVf.post(params);
                }

                var params = angular.extend({}, { customerId: customerId }, body);
                return requestPost.post(params);
            }

            function del(customerId, vfId) {
                return requestDel.del({ customerId: customerId, vfId: vfId });
            }

            return {
                list: function (customerId) {
                    return get(customerId);
                },
                create: function (customerId, body) {
                    return post(customerId, false, body);
                },
                destroy: function (customerId, vfId) {
                    return del(customerId, vfId);
                },
                container: {
                    list: function (customerId, vfId) {
                        return get(customerId, vfId, 'containers');
                    }
                },
                job: {
                    list: function (customerId, vfId, queryParameters) {
                        return get(customerId, vfId, 'jobs', queryParameters);
                    },
                    history: function (customerId, vfId, queryParameters) {
                        return get(customerId, vfId, 'jobs/history', queryParameters);
                    },
                },
                patch: {
                    list: function (customerId, vfId, queryParameters) {
                        return get(customerId, vfId, 'patches', queryParameters);
                    },
                    history: function (customerId, vfId, queryParameters) {
                        return get(customerId, vfId, 'patches/history', queryParameters);
                    },
                },
                setting: {
                    list: function (customerId, vfId) {
                        return get(customerId, vfId, 'settings');
                    },

                    update: function (customerId, vfId, body) {
                        return post(customerId, vfId, body, 'settings');
                    }
                },

            };
        }]);
})();