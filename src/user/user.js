(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaUser', ['SeaRequest', 'seaUserGroup', 'seaUserLocation', 'seaUserSetting', 'seaUserSubstitude',
        function seaUser(SeaRequest, seaUserGroup, seaUserLocation, seaUserSetting, seaUserSubstitude) {
            var request = new SeaRequest('user/{uId}'),
                requestUser = new SeaRequest('user/{uId}/{sub}'),
                requestCustomer = new SeaRequest('user/{uId}/customer'),
                requestUsers = new SeaRequest('user');
            var requestMicroService = new SeaRequest('user/{uId}', 'v3'),
                requestUserMicroService = new SeaRequest('user/{uId}/{sub}', 'v3'),
                requestCustomerMicroService = new SeaRequest('user/{uId}/customer', 'v3'),
                requestUsersMicroService = new SeaRequest('user', 'v3');

            function create(params) {
                return requestMicroService.post(params);
            }

            function get(uId) {
                return request.get({
                    uId: uId
                });
            }

            function update(user) {
                return requestMicroService.put(user);
            }

            function destroy(uId) {
                return requestMicroService.del({
                    uId: uId
                });
            }

            function search(params) {
                return request.get(params);
            }

            function listCustomers(uId) {
                return requestCustomer.get({
                    uId: uId
                });
            }

            function listUsers(cId, includeLocation) {
                return requestUsers.get({
                    customerId: cId,
                    includeLocation: includeLocation
                });
            }

            function deactivateTwoFactor(uId, password) {
                return requestUser.del({
                    uId: uId,
                    password: password,
                    sub: 'twofactor'
                });
            }

            return {
                /**
                 * create user
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String} [prename]
                 * @config {String} [surname]
                 * @config {String} [email]
                 * @config {Number} [role]
                 * @config {String} [phone]
                 */
                create: function (params) {
                    return create(params);
                },

                get: function (gId) {
                    return get(gId);
                },

                /**
                 * update user
                 * @param {Object} user
                 * @config {String} [customerId]
                 * @config {String} [prename]
                 * @config {String} [surname]
                 * @config {String} [email]
                 * @config {Number} [role]
                 * @config {String} [phone]
                 */
                update: function (user) {
                    return update(user);
                },

                destroy: function (uId) {
                    return destroy(uId);
                },

                /**
                 * search users
                 * @param   {Object}   params
                 * @config  {String}   [query]
                 * @config  {String}   [customerId]
                 * @config  {Boolean}  [includeLocation]
                 */
                search: function (params) {
                    return search(params);
                },
                
                list: function(cId, includeLocation) {
                    return listUsers(cId, includeLocation);
                },
                
                group: seaUserGroup,
                location: seaUserLocation,
                setting: seaUserSetting,
                substitude: seaUserSubstitude,
                customer: {
                    list: function (uId) {
                        return listCustomers(uId);
                    }
                },
                twofactor: {
                    /**
                     * deactivate two-factor
                     * @param   {String}   uId
                     * @param   {String}   password
                     */
                    deactivate: function (uId, password) {
                        return deactivateTwoFactor(uId, password);
                    }
                }
            };
        }]);
})();