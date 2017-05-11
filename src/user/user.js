(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaUser', ['SeaRequest', 'seaUserGroup', 'seaUserLocation', 'seaUserSetting', 'seaUserSubstitude',
        function seaUser(SeaRequest, seaUserGroup, seaUserLocation, seaUserSetting, seaUserSubstitude) {
            var request = new SeaRequest('user/{uId}'),
                requestUser = new SeaRequest('user/{uId}/{sub}'),
                requestCustomer = new SeaRequest('user/{uId}/customer');

            function create(params) {
                return request.post(params);
            }

            function get(uId) {
                return request.get({
                    uId: uId
                });
            }

            function update(user) {
                return request.put(user);
            }

            function destroy(uId) {
                return request.del({
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