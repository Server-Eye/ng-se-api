(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAuth', ['SeaRequest', 'seaConfig',
    function seaAuth(SeaRequest, seaConfig) {
            var request = new SeaRequest('auth/{action}');
            var requestMs = new SeaRequest(seaConfig.getMicroServiceUrl() + '/' + seaConfig.getMicroServiceApiVersion() + '/auth/{action}');

            function createApiKey(params) {
                params = params || {};
                params.action = 'key';

                return request.post(params);
            }

            function login(params) {
                params = params || {};
                params.action = 'login';

                return request.post(params);
            }

            function logout(params) {
                params = params || {};
                params.action = 'logout';

                return request.get(params);
            }

            function requestResetLink(params) {
                params = params || {};
                params.action = 'reset';

                return request.get(params);
            }
            
            function resetPassword(params) {
                params = params || {};
                params.action = 'reset';

                return request.post(params);
            }

            function token(params) {
                params = params || {};
                params.action = 'token';

                return requestMs.post(params);
            }

            return {
                /**
                 * create apiKey
                 * @param {Object} params
                 * @config {String} [email]
                 * @config {String} [password]
                 * @config {Number} [type]
                 * @config {Number} [validUntil]
                 * @config {Number} [maxUses]
                 */
                createApiKey: function (params) {
                    return createApiKey(params);
                },

                /**
                 * login
                 * @param {Object} params
                 * @config {String} [apiKey]
                 * @config {String} [email]
                 * @config {String} [password]
                 * @config {Boolean} [createApiKey]
                 * @config {String} [apiKeyName]
                 */
                login: function (params) {
                    return login(params);
                },

                logout: function () {
                    return logout();
                },
                
                requestResetLink: function (params) {
                    return requestResetLink(params);
                },

                resetPassword: function (params) {
                    return resetPassword(params);
                },

                token: function(params) {
                    return token(params);
                },
            };
    }]);
})();