(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaTag', ['SeaRequest', 'seaTagHelper',
        function (SeaRequest, seaTagHelper) {
            var requestGroup = new SeaRequest(seaTagHelper.getUrl('group/{tagGroupId}'));
            var requestCustomerGroup = new SeaRequest(seaTagHelper.getUrl('group/customer/{customerId}'));

            function createTagGroup(params) {
                return requestGroup.post(params);
            }

            function deleteTagGroup(tagGroupId) {
                return requestGroup.del({
                    tagGroupId: tagGroupId,
                });
            }

            function updateTagGroup(params) {
                return requestGroup.put(params);
            }

            function getTagGroupById(tagGroupId) {
                return requestGroup.get({
                    tagGroupId: tagGroupId,
                });
            }

            function getTagGroupByCustomerId(customerId, params) {
                params = params || {};
                return requestCustomerGroup.get(angular.extend({}, {
                    customerId: customerId,
                }, params));
            }

            return {
                group: {
                    create: function (params) {
                        return createTagGroup(params);
                    },
                    destroy: function (tagGroupId) {
                        return deleteTagGroup(tagGroupId);
                    },
                    update: function (params) {
                        return updateTagGroup(params);
                    },
                    get: function (tagGroupId) {
                        return getTagGroupById(tagGroupId);
                    },
                    listByCustomerId: function (customerId, params) {
                        return getTagGroupByCustomerId(customerId, params);
                    },
                },
            };
        }]);
})();