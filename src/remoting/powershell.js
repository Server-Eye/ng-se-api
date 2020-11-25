(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPowershell', ['SeaRequest',
    function seaRemotingPowershell(SeaRequest) {
            var request = new SeaRequest('powershell/{customerId}/{cId}/{action}', 'v3');
        
            function start(params) {
                params = params || {};
                params.action = 'start';
                
                return request.post(params);
            }

            return {
                /**
                 * start a powershell session on a remote machine
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String} [cId]
                 */
                start: function (params) {
                    return start(params);
                }
            };
    }]);
})();