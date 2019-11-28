(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentType', ['SeaRequest',
    function seaAgentType(SeaRequest) {
            var request = new SeaRequest('agent/type');
            var requestFaq = new SeaRequest('agent/type/{agentType}/faq');

            function format(agentKnown) {
                if(agentKnown.updateDate) {
                    agentKnown.updateDate = new Date(agentKnown.updateDate);
                }
                
                return agentKnown;
            }
        
            function listSettings(akId) {
                return request.get({
                    akId: akId
                }, 'agent/type/{akId}/setting');
            }

            function list(params) {
                return request.get(params).then(function (aks) { return aks.map(format); });
            }

            function listFaq(agentType) {
                return requestFaq.get({agentType: agentType});
            }

            return {
                setting: {
                    /**
                     * list settings of an agent type
                     * @param {Object} params
                     * @config {String} [akId]
                     */
                    list: function (akId) {
                        return listSettings(akId);
                    }
                },

                list: list,
                faq: {
                    list: function(agentType) {
                        return listFaq(agentType);
                    },
                },
            };
    }]);
})();