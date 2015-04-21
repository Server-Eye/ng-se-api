(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainer', ['SeaRequest',
                                                   'seaContainerMisc', 'seaContainerNote', 'seaContainerNotification',
                                                   'seaContainerProposal', 'seaContainerState', 'seaContainerTag', 'seaContainerTemplate',
    function seaContainer(SeaRequest, seaContainerMisc, seaContainerNote, seaContainerNotification, seaContainerProposal, seaContainerState, seaContainerTag, seaContainerTemplate) {
            var request = new SeaRequest('container/{cId}');

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

            function update(container) {
                return request.put(container);
            }

            function destroy(cId) {
                return request.del({
                    cId: cId
                });
            }

            return {
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

                actionlog: seaContainerMisc.actionlog,
                inventory: seaContainerMisc.inventory,
                note: seaContainerNote,
                notification: seaContainerNotification,
                pcvisit: seaContainerMisc.pcvisit,
                proposal: seaContainerProposal,
                state: seaContainerState,
                tag: seaContainerTag,
                template: seaContainerTemplate
            };
    }]);
})();