(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaUser', ['SeaRequest', 'seaUserGroup', 'seaUserSetting', 'seaUserSubstitude',
    function seaUser(SeaRequest, seaUserGroup, seaUserSetting, seaUserSubstitude) {
            var request = new SeaRequest('user/{uId}');
        
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

                setting: seaUserSetting,
                group: seaUserGroup,
                substitude: seaUserSubstitude
            };
    }]);
})();