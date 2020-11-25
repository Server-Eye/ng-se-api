(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMeSetting', ['SeaRequest',
    function seaMeSetting(SeaRequest) {
            var request = new SeaRequest('me/setting');
            var requestAction = new SeaRequest('me/setting/{action}');
            var requestMicroService = new SeaRequest('me/setting', 'v3');
            var requestActionMicroService = new SeaRequest('me/setting/{action}', 'v3');

            function list() {
                return request.get();
            }

            function update(settings) {
                settings = settings || {};
                return requestMicroService.put(settings);
            }

            function resetSecret(password) {
                return requestActionMicroService.post({
                    action: 'secret/reset',
                    password: password,
                });
            }

            return {
                list: function (uId) {
                    return list(uId);
                },

                /**
                 * update user
                 * @param {Object} settings
                 */
                update: function (settings) {
                    return update(settings);
                },

                secret: {
                    reset: function(password) {
                        return resetSecret(password);
                    }
                }
            };
    }]);
})();