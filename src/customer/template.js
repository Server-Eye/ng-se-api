(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerTemplate', ['SeaRequest',
    function seaCustomerTemplate(SeaRequest) {
            var request = new SeaRequest('customer/template/{tId}'),
                requestAgent = new SeaRequest('customer/template/{tId}/agent/{aId}');

            function list() {
                return request.get();
            }
        
            function listAgents(tId) {
                return requestAgent.get({
                    tId: tId
                });
            }

            function destroy(tId) {
                return request.del({
                    tId: tId
                });
            }
        
            function destroyAgent(tId, aId) {
                return request.del({
                    tId: tId,
                    aId: aId
                });
            }

            return {
                list: function () {
                    return list();
                },

                destroy: function (tId) {
                    return destroy(tId);
                },
                
                agent: {
                    list: function(tId) {
                        return listAgents(tId);
                    },
                    destroy: function(tId, aId) {
                        return destroyAgent(tId, aId);
                    }
                }
            };
    }]);
})();