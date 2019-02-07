(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatchViewFilter', ['SeaRequest', 'seaPatchHelper',
        function seaUser(SeaRequest, seaPatchHelper) {
            var request = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/viewFilters')),
                requestVf = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/viewFilter/{vfId}/{action}'));

                function get(customerId, vfId, action) {
                    if(vfId) {
                        return requestVf.get({
                            customerId: customerId,
                            vfId: vfId,
                            action: action,
                        });
                    }
    
                    return request.get({
                        customerId: customerId,
                    });
                }

                function post(customerId, vfId, body, action) {
                    if(vfId) {
                        var params = angular.extend({}, {customerId: customerId, vfId, vfId, action: action}, body);
                        requestVf.post(params);
                    }
                    
                    var params = angular.extend({}, {customerId: customerId}, body);
                    return request.post(params);
                }

            return {
                list: function(customerId) {
                    return get(customerId);
                },
                create: function(customerId, body) {
                    return post(customerId, false, body);
                },
                container: {
                    list: function(customerId, vfId) {
                        return get(customerId, vfId, 'containers');
                    }
                },
                job: {
                    list: function(customerId, vfId) {
                        return get(customerId, vfId, 'jobs');
                    }
                },
                patch: {
                    list: function(customerId, vfId) {
                        return get(customerId, vfId, 'patches');
                    }
                },
                setting: {
                    list: function(customerId, vfId) {
                        return get(customerId, vfId, 'settings');
                    },

                    update: function(customerId, vfId, body) {
                        return post(customerId, vfId, body, 'settings');
                    }
                },

            };
        }]);
})();