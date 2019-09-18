(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentState', ['SeaRequest',
        function seaAgentState(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/state/{method}'),
                stateRequest = new SeaRequest('agent/{aId}/state/{sId}'),
                hintRequest = new SeaRequest('agent/{aId}/state/{sId}/hint');

            function formatState(state) {
                state.date = new Date(state.date);
                state.lastDate = new Date(state.lastDate);

                if (state.silencedUntil) {
                    state.silencedUntil = new Date(state.silencedUntil);
                }

                if (state.hints) {
                    angular.forEach(state.hints, formatHint);
                }

                return state;
            }

            function formatHint(hint) {
                hint.date = new Date(hint.date);

                if (hint.until) {
                    hint.until = new Date(hint.until);
                }

                return hint;
            }

            function hint(params) {
                return hintRequest.post(params).then(formatHint);
            }

            function stats(aId, params) {
                params = params || {};
                params.aId = aId;
                params.method = 'stats';

                return request.get(params);
            }

            function list(aId, params) {
                params = params || {};
                params.aId = aId;

                if (angular.isArray(params.aId)) {
                    return request.post(params, 'agent/state').then(function (statesById) {
                        if (angular.isArray(statesById)) {
                            var n = {};
                            n[params.aId[0]] = statesById;
                            statesById = n;
                        }

                        angular.forEach(Object.keys(statesById), function (key) {
                            angular.forEach(statesById[key], formatState);
                        });

                        return statesById;
                    });
                }
                return request.get(params).then(function (states) {
                    angular.forEach(states, formatState);

                    return states;
                });
            }

            function get(aId, sId, params) {
                params = params || {};
                params.sId = sId;
                params.aId = aId;

                return stateRequest.get(params).then(function (state) {
                    return formatState(state);
                });
            }

            return {
                /**
                 * create agent state hint
                 * @param {Object} params
                 * @config {String} [aId]
                 * @config {String} [sId]
                 * @config {String} [author]
                 * @config {Number} [hintType]
                 * @config {String} [message]
                 * @config {String} [assignedUser]
                 * @config {Array} [mentionedUsers]
                 * @config {Boolean} [private]
                 * @config {Number} [until]
                 */
                hint: function (params) {
                    return hint(params);
                },

                /**
                 * list agent states
                 * @param   {String}   aId
                 * @param {Object}
                 * @config {Number} [limit]
                 * @config {Number} [start]
                 * @config {Number} [end]
                 * @config {Boolean} [includeHints]
                 * @config {Boolean} [includeRawData]
                 * @config {String} [format]
                 */
                list: function (aId, params) {
                    return list(aId, params);
                },

                /**
               * get state by Id
               * @param   {String}   aId
               * @param   {String}   sId
               * @param {Object}
               * @config {Boolean} [includeHints]
               * @config {Boolean} [includeMessage]
               * @config {Boolean} [includeRawData]
               * @config {String} [format]
               */
                get: function (aId, sId, params) {
                    return get(aId, sId, params);
                },

                /**
                 * list agent state stats
                 * @param   {String}   aId
                 * @param {Object}
                 * @config {Number} [start] : now
                 * @config {Number} [end]   : now - 12 months
                 */
                stats: function (aId, params) {
                    return stats(aId, params);
                }
            };
        }]);
})();