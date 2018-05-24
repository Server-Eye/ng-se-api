(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainer', ['SeaRequest',
                                                   'seaContainerMisc', 'seaContainerNote', 'seaContainerNotification',
                                                   'seaContainerProposal', 'seaContainerState', 'seaContainerTag', 'seaContainerTemplate',
    function seaContainer(SeaRequest, seaContainerMisc, seaContainerNote, seaContainerNotification, seaContainerProposal, seaContainerState, seaContainerTag, seaContainerTemplate) {
            var request = new SeaRequest('container/{cId}/{action}');
            var multiRequest = new SeaRequest('container/{action}');

            function formatContainer(container) {
                if (container.lastBootUpTime) {
                    container.lastBootUpTime = new Date(container.lastBootUpTime);
                }
                return container;
            }

            function get(cId) {
                return request.get({
                    cId: cId
                }).then(formatContainer);
            }
        
            function listAgents(cId) {
                return request.get({
                    cId: cId,
                    action: 'agents'
                });
            }

            function listProposals(cId) {
                return multiRequest.post({
                    cId: cId,
                    action: 'proposal'
                });
            }

            function update(container) {
                return request.put(container);
            }

            function destroy(cId) {
                return request.del({
                    cId: cId
                });
            }

            var api = {
                get: function (cId) {
                    return get(cId);
                },

                /**
                 * update container
                 * @param {Object} container
                 * @config {String} [cId]
                 * @config {String} [name]
                 * @config {Boolean} [alertOffline]
                 * @config {Boolean} [alertShutdown]
                 * @config {Number} [maxHeartbeatTimeout]
                 */
                update: function (container) {
                    return update(container);
                },

                destroy: function (cId) {
                    return destroy(cId);
                },
                
                agent: {
                    list: function (cId) {
                        return listAgents(cId);
                    }
                },

                note: seaContainerNote,
                notification: seaContainerNotification,
                proposal: seaContainerProposal,
                state: seaContainerState,
                tag: seaContainerTag,
                template: seaContainerTemplate,
                listProposals: listProposals,
            };
                
            angular.extend(api, seaContainerMisc);
        
            return api;
    }]);
})();