"use strict";

angular.module('ngSeApi').factory('sesAgent', ['SesRequest',
                                             'sesAgentNote', 'sesAgentNotification', 'sesAgentMisc', 
                                             'sesAgentSetting', 'sesAgentState',
  function sesAgent(SesRequest, sesAgentNote, sesAgentNotification, sesAgentMisc, sesAgentSetting, sesAgentState) {
        var request = new SesRequest('agent/{aId}');

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
            copy: sesAgentMisc.copy,

            get: function (aId) {
                return get(aId);
            },

            /**
             * update agent by id
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

            note: sesAgentNote,
            actionlog: sesAgentMisc.actionlog,
            chart: sesAgentMisc.chart,
            notification: sesAgentNotification,
            setting: sesAgentSetting,
            state: sesAgentState
        };
}]);
