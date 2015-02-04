"use strict";

angular.module('ngSeApi').factory('seaAgent', ['SeaRequest',
                                             'seaAgentNote', 'seaAgentNotification', 'seaAgentMisc', 
                                             'seaAgentSetting', 'seaAgentState', 'seaAgentType',
  function seaAgent(SeaRequest, seaAgentNote, seaAgentNotification, seaAgentMisc, seaAgentSetting, seaAgentState, seaAgentType) {
        var request = new SeaRequest('agent/{aId}');

        function create(params) {
            return request.post(params);
        }

        function get(aId) {
            return request.get({
                aId: aId
            });
        }

        function update(agent) {
            return request.put(agent);
        }

        function destroy(aId) {
            return request.del({
                aId: aId
            });
        }

        return {
            /**
             * create agent
             * @param {Object} params
             * @config {String} [parentId]
             * @config {String} [type]
             */
            create: function (params) {
                return create(params);
            },
            copy: seaAgentMisc.copy,

            get: function (aId) {
                return get(aId);
            },

            /**
             * update agent
             * @param {Object} agent
             * @config {String} [aId]
             * @config {String} [name]
             * @config {Number} [interval]
             */
            update: function (agent) {
                return update(agent);
            },

            destroy: function (aId) {
                return destroy(aId);
            },

            note: seaAgentNote,
            actionlog: seaAgentMisc.actionlog,
            chart: seaAgentMisc.chart,
            notification: seaAgentNotification,
            setting: seaAgentSetting,
            state: seaAgentState,
            category: seaAgentMisc.category,
            type: seaAgentType
        };
}]);
