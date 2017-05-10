(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMeTwoFactor', ['SeaRequest',
        function seaMeLocation(SeaRequest) {
            var request = new SeaRequest('me/twofactor/{sub}');

            function get() {
                return request.get();
            }

            function getSecret(params) {
                params = params || {};
                params.sub = 'secret';
                return request.get(params);
            }

            function enable(params) {
                return request.post(params);
            }

            function disable(params) {
                return request.del(params);
            }

            return {
                /**
                 * is two-factor enabled
                 */
                isEnabled: function () {
                    return get();
                },

                /**
                 * enable two-factor authentication
                 * @param   {Object} params
                 * @config  {string}  format
                 * @returns {Object} promise
                 */
                getSecret: function (params) {
                    return getSecret(params);
                },

                /**
                 * enable two-factor authentication
                 * @param   {Object} params
                 * @config  {string}  password
                 * @config  {string}  code
                 * @returns {Object} promise
                 */
                enable: function (params) {
                    return enable(params);
                },

                /**
                 * disable two-factor authentication
                 * @param   {Object} params
                 * @config  {string}  password
                 * @config  {string}  code
                 * @returns {Object} promise
                 */
                disable: function (params) {
                    return disable(params);
                }
            };
        }]);
})();