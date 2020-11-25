(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerBucket', ['SeaRequest',
        function seaCustomerDispatchTime(SeaRequest) {
            var request = new SeaRequest('customer/bucket/{bId}'),
                userRequest = new SeaRequest('customer/bucket/{bId}/user/{uId}');
            var requestMicroService = new SeaRequest('customer/bucket/{bId}', 'v3'),
                userRequestMicroService = new SeaRequest('customer/bucket/{bId}/user/{uId}', 'v3');

            function create(params) {
                return requestMicroService.post(params);
            }

            function list() {
                return request.get();
            }

            function update(bucket) {
                return request.put(bucket);
            }

            function destroy(bId) {
                return requestMicroService.del({
                    bId: bId
                });
            }

            function listUser(bId) {
                return userRequest.get({
                    bId: bId
                });
            }

            function addUser(params) {
                return userRequestMicroService.put(params);
            }

            function removeUser(bId, uId) {
                return userRequestMicroService.del({
                    bId: bId,
                    uId: uId
                });
            }

            return {
                /**
                 * create bucket
                 * @param {Object} params
                 * @config {String} [name]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function () {
                    return list();
                },

                /**
                 * update bucket
                 * @param {Object} params
                 * @config {String} [bId]
                 * @config {String} [name]
                 */
                update: function (bucket) {
                    return update(bucket);
                },

                destroy: function (bId) {
                    return destroy(bId);
                },

                user: {
                    list: function (bId) {
                        return listUser(bId);
                    },

                    /**
                     * add user to bucket
                     * @param {Object} params
                     * @config {String} [bId]
                     * @config {String} [uId]
                     */
                    create: function (params) {
                        return addUser(params);
                    },

                    /**
                     * remove user from bucket
                     * @param {String} [bId]
                     * @param {String} [uId]
                     */
                    destroy: function (bId, uId) {
                        return removeUser(bId, uId);
                    }
                }
            };
        }]);
})();