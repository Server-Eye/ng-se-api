/**
 * ng-se-api
 * @version 0.2.1
 * @link https://github.com/Server-Eye/ng-se-api.git
 * @license MIT
 */(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
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
})();
},{}],2:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentMisc', ['SeaRequest',
    function seaAgentMisc(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/{action}');

            function listActionlog(aId, params) {
                params = params || {};
                params.aId = aId;
                params.action = 'actionlog';
                return request.get(params);
            }

            function getChart(aId, params) {
                params = params || {};
                params.aId = aId;
                params.action = 'chart';
                return request.get(params);
            }

            function copy(aId, parentId) {
                var params = {};
                params.aId = aId;
                params.parentId = parentId;
                params.action = 'copy';
                return request.post(params);
            }

            function listCategories() {
                return request.get({}, 'agent/category');
            }

            return {
                actionlog: {
                    /**
                     * list action log entries
                     * @param   {String} aId    agent id
                     * @param   {Object} params
                     * @config  {Number} start
                     * @config  {Number} limit
                     * @returns {Object} promise
                     */
                    list: function (aId, params) {
                        return listActionlog(aId, params);
                    }
                },
                chart: {
                    /**
                     * get chart config and values
                     * @param   {String} aId    agent id
                     * @param   {Object} params
                     * @config  {Number} start
                     * @config  {Number} limit
                     * @config  {Number} valueType
                     * @returns {Object} promise
                     */
                    get: function (aId, params) {
                        return getChart(aId, params);
                    }
                },
                category: {
                    list: listCategories
                },
                /**
                 * copy agent to a parent
                 * @param   {String} aId
                 * @param   {String}   parentId
                 * @returns {Object} promise
                 */
                copy: function (aId, parentId) {
                    return copy(aId, parentId);
                }
            };
    }]);
})();
},{}],3:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentNote', ['SeaRequest',
    function seaAgentNote(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/note/{nId}');

            function formatNote(note) {
                note.postedOn = new Date(note.postedOn);
                return note;
            }

            function create(params) {
                return request.post(params).then(formatNote);
            }

            function list(aId) {
                return request.get({
                    aId: aId
                }).then(function (notes) {
                    angular.forEach(notes, formatNote);

                    return notes;
                });
            }

            function destroy(aId, nId) {
                return request.del({
                    aId: aId,
                    nId: nId
                });
            }

            return {
                /**
                 * create agent note
                 * @param {Object} params
                 * @config {String} [aId]
                 * @config {String} [message]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function (aId) {
                    return list(aId);
                },

                destroy: function (aId, nId) {
                    return destroy(aId, nId);
                }
            };
    }]);
})();
},{}],4:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentNotification', ['SeaRequest',
    function seaAgentNitification(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/notification/{nId}');

            function create(params) {
                return request.post(params);
            }

            function update(notification) {
                return request.put(notification);
            }

            function list(aId) {
                return request.get({
                    aId: aId
                });
            }

            function destroy(aId, nId) {
                return request.del({
                    aId: aId,
                    nId: nId
                });
            }

            return {
                /**
                 * create notification
                 * @param {Object} params
                 * @config {String} [aId]
                 * @config {String} [userId]
                 * @config {Boolean} [mail]
                 * @config {Boolean} [phone]
                 * @config {Boolean} [ticket]
                 * @config {String} [deferId]
                 */
                create: function (params) {
                    return create(params);
                },

                /**
                 * update notification
                 * @param {Object} params
                 * @config {String} [nId]
                 * @config {String} [aId]
                 * @config {String} [userId]
                 * @config {Boolean} [mail]
                 * @config {Boolean} [phone]
                 * @config {Boolean} [ticket]
                 * @config {String} [deferId]
                 */
                update: function (notification) {
                    return update(notification);
                },

                list: function (aId) {
                    return list(aId);
                },

                destroy: function (aId, nId) {
                    return destroy(aId, nId);
                }
            };
    }]);
})();
},{}],5:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentSetting', ['SeaRequest',
    function seaAgentSetting(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/setting/{key}');

            function update(setting) {
                return request.put(params);
            }

            function list(aId) {
                return request.get({
                    aId: aId
                });
            }

            return {
                /**
                 * create agent note
                 * @param {Object} params
                 * @config {String} [aId]
                 * @config {String} [key]
                 * @config {String} [value]
                 */
                update: function (setting) {
                    return update(setting);
                },

                list: function (aId) {
                    return list(aId);
                }
            };
    }]);
})();
},{}],6:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentState', ['SeaRequest',
    function seaAgentState(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/state');

            function formatState(state) {
                state.date = new Date(state.date);
                state.lastDate = new Date(state.lastDate);
                return state;
            }

            function hint(setting) {
                return request.post(params);
            }

            function list(aId, params) {
                params = params || {};
                params.aId = aId;

                if (angular.isArray(params.aId)) {
                    return request.post(params, 'agent/state').then(function (statesById) {
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
                }
            };
    }]);
})();
},{}],7:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentType', ['SeaRequest',
    function seaAgentType(SeaRequest) {
            var request = new SeaRequest('agent/type');

            function listSettings(akId) {
                return request.get({
                    akId: akId
                }, 'agent/type/{akId}/setting');
            }

            function list() {
                return request.get();
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

                list: list
            };
    }]);
})();
},{}],8:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAuth', ['SeaRequest',
    function seaAuth(SeaRequest) {
            var request = new SeaRequest('auth/{action}');

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
                }
            };
    }]);
})();
},{}],9:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').provider('seaConfig', ['$httpProvider', function SeaConfigProvider($httpProvider) {
        var config = {
            baseUrl: 'https://api.server-eye.de',
            apiVersion: 2,
            apiKey: null,
            getUrl: function (path) {
                return [this.baseUrl, this.apiVersion, path].join('/');
            }
        };

        $httpProvider.interceptors.push(function () {
            return {
                'request': function (reqConfig) {
                    if (config.apiKey) {
                        reqConfig.headers['x-api-key'] = config.apiKey;
                    }

                    return reqConfig;
                },

                'response': function (response) {
                    return response;
                }
            };
        });

        this.setBaseUrl = function (baseUrl) {
            config.baseUrl = baseUrl;
        }

        this.setApiVersion = function (apiVersion) {
            config.apiVersion = apiVersion;
        }

        this.setApiKey = function (apiKey) {
            config.apiKey = apiKey;
        }

        this.$get = function ($http) {
            return {
                getBaseUrl: function () {
                    return config.baseUrl;
                },
                getApiVersion: function () {
                    return config.apiVersion;
                },
                getApiKey: function () {
                    return config.apiKey;
                },
                setApiKey: function (apiKey) {
                    config.apiKey = apiKey;
                },
                getUrl: function (path) {
                    return [config.baseUrl, config.apiVersion, path].join('/');
                }
            }
        };
    }]);
})();
},{}],10:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainer', ['SeaRequest',
                                                   'seaContainerMisc', 'seaContainerNote', 'seaContainerNotification',
                                                   'seaContainerProposal', 'seaContainerState', 'seaContainerTemplate',
    function seaContainer(SeaRequest, seaContainerMisc, seaContainerNote, seaContainerNotification, seaContainerProposal, seaContainerState, seaContainerTemplate) {
            var request = new SeaRequest('container/{cId}');

            function get(cId) {
                return request.get({
                    cId: cId
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
                template: seaContainerTemplate
            };
    }]);
})();
},{}],11:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerMisc', ['SeaRequest',
    function seaContainerMisc(SeaRequest) {
            var request = new SeaRequest('container/{cId}/{action}');

            function listActionlog(cId, params) {
                params = params || {};
                params.cId = cId;
                params.action = 'actionlog';
                return request.get(params);
            }

            function getInventory(cId, params) {
                params = params || {};
                params.cId = cId;
                params.action = 'inventory';
                return request.get(params);
            }

            function connectPcvisit(cId, params) {
                params = params || {};
                params.cId = cId;
                params.action = 'pcvisit';
                return request.get(params);
            }

            return {
                actionlog: {
                    /**
                     * list action log entries
                     * @param   {String} cId
                     * @param   {Object} params
                     * @config  {Number} [start]
                     * @config  {Number} [limit]
                     * @returns {Object} promise
                     */
                    list: function (cId, params) {
                        return listActionlog(cId, params);
                    }
                },

                inventory: {
                    /**
                     * get inventory of the container
                     * @param   {String}   cId
                     * @param   {String}   params
                     * @config {String} [format]
                     * @returns {Object} promise
                     */
                    get: function (cId, params) {
                        return getInventory(cId, params);
                    }
                },
                pcvisit: {
                    /**
                     * install and connect to pcvisit
                     * @param   {String} cId
                     * @param   {Object}   params
                     * @config  {String}   [supporterId]
                     * @config  {String}   [supporterPassword]
                     * @config  {String}   [user]
                     * @config  {String}   [password]
                     * @config  {String}   [domain]
                     * @returns {Object} promise
                     */
                    connect: function (cId, params) {
                        return connectPcvisit(cId, params);
                    }
                }
            };
    }]);
})();
},{}],12:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerNote', ['SeaRequest',
    function seaContainerNote(SeaRequest) {
            var request = new SeaRequest('container/{cId}/note/{nId}');

            function formatNote(note) {
                note.postedOn = new Date(note.postedOn);
                return note;
            }

            function create(params) {
                return request.post(params).then(formatNote);
            }

            function list(cId) {
                return request.get({
                    cId: cId
                }).then(function (notes) {
                    angular.forEach(notes, formatNote);

                    return notes;
                });
            }

            function destroy(cId, nId) {
                return request.del({
                    aId: cId,
                    nId: nId
                });
            }

            return {
                /**
                 * create note
                 * @param {Object} params
                 * @config {String} [cId]
                 * @config {String} [message]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function (cId) {
                    return list(cId);
                },

                destroy: function (cId, nId) {
                    return destroy(cId, nId);
                }
            };
    }]);
})();
},{}],13:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerNotification', ['SeaRequest',
    function seaContainerNotification(SeaRequest) {
            var request = new SeaRequest('container/{cId}/notification/{nId}');

            function create(params) {
                return request.post(params);
            }

            function update(notification) {
                return request.put(notification);
            }

            function list(cId) {
                return request.get({
                    cId: cId
                });
            }

            function destroy(cId, nId) {
                return request.del({
                    cId: cId,
                    nId: nId
                });
            }

            return {
                /**
                 * create notification
                 * @param {Object} params
                 * @config {String} [cId]
                 * @config {String} [userId]
                 * @config {Boolean} [mail]
                 * @config {Boolean} [phone]
                 * @config {Boolean} [ticket]
                 * @config {String} [deferId]
                 */
                create: function (params) {
                    return create(params);
                },

                /**
                 * update notification
                 * @param {Object} params
                 * @config {String} [nId]
                 * @config {String} [cId]
                 * @config {String} [userId]
                 * @config {Boolean} [mail]
                 * @config {Boolean} [phone]
                 * @config {Boolean} [ticket]
                 * @config {String} [deferId]
                 */
                update: function (notification) {
                    return update(notification);
                },

                list: function (cId) {
                    return list(cId);
                },

                destroy: function (cId, nId) {
                    return destroy(cId, nId);
                }
            };
    }]);
})();
},{}],14:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerProposal', ['SeaRequest',
    function seaContainerProposal(SeaRequest) {
            var request = new SeaRequest('container/{cId}/proposal/{pId}');

            function accept(cId, pId) {
                return request.put({
                    cId: cId,
                    pId: pId
                });
            }

            function list(cId) {
                return request.get({
                    cId: cId
                });
            }

            function deny(cId, pId) {
                return request.del({
                    cId: cId,
                    pId: pId
                });
            }

            function listSettings(cId, pId) {
                return request.get({
                    cId: cId,
                    pId: pId
                }, 'container/{cId}/proposal/{pId}/setting');
            }

            return {
                accept: function (cId, pId) {
                    return accept(cId, pId);
                },

                list: function (cId) {
                    return list(cId);
                },

                deny: function (cId, pId) {
                    return deny(cId, pId);
                },

                settings: {
                    list: function (cId, pId) {
                        return listSettings(cId, pId);
                    }
                }
            };
    }]);
})();
},{}],15:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerState', ['SeaRequest',
    function seaContainerState(SeaRequest) {
            var request = new SeaRequest('container/{cId}/state');

            function formatState(state) {
                state.date = new Date(state.date);
                state.lastDate = new Date(state.lastDate);
                return state;
            }

            function hint(setting) {
                return request.post(params);
            }

            function list(cId, params) {
                params = params || {};
                params.cId = cId;

                if (angular.isArray(params.cId)) {
                    return request.post(params, 'container/state').then(function (statesById) {
                        angular.forEach(Object.keys(statesById), function (key) {
                            angular.forEach(statesById[key], formatState);
                        });
                    });
                }
                return request.get(params).then(function (states) {
                    angular.forEach(states, formatState);

                    return states;
                });
            }

            return {
                /**
                 * create container state hint
                 * @param {Object} params
                 * @config {String} [cId]
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
                 * list container states
                 * @param   {String}   cId
                 * @param {Object}
                 * @config {Number} [limit]
                 * @config {Number} [start]
                 * @config {Number} [end]
                 * @config {Boolean} [includeHints]
                 * @config {Boolean} [includeRawData]
                 * @config {String} [format]
                 */
                list: function (cId, params) {
                    return list(cId, params);
                }
            };
    }]);
})();
},{}],16:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerTemplate', ['SeaRequest',
    function seaContainerTemplate(SeaRequest) {
            var request = new SeaRequest('container/{cId}/template/{tId}');

            function create(cId) {
                return request.post({
                    cId: cId
                });
            }

            function assign(cId, tId) {
                return request.post({
                    cId: cId,
                    tId: tId
                });
            }

            return {
                /**
                 * create template form system
                 * @param {String} cId
                 */
                create: function (cId) {
                    return create(cId);
                },

                /**
                 * assign a template to a system
                 * @param {String} cId
                 * @param {String} tId
                 */
                assign: function (cId, tId) {
                    return assign(cId, tId);
                }
            };
    }]);
})();
},{}],17:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomer', ['SeaRequest', 'seaCustomerSetting', 'seaCustomerDispatchTime',
    function seaCustomer(SeaRequest, seaCustomerSetting, seaCustomerDispatchTime) {
            var request = new SeaRequest('customer/{cId}');

            function get(cId) {
                return request.get({
                    cId: cId
                });
            }

            function update(customer) {
                return request.put(customer);
            }

            return {
                get: function (cId) {
                    return get(cId);
                },

                /**
                 * update customer
                 * @param {Object} customer
                 * @config {String} [cId]
                 * @config {String} [country]
                 * @config {Number} [customerNumberIntern]
                 * @config {Number} [customerNumberExtern]
                 * @config {String} [companyName]
                 * @config {String} [street]
                 * @config {String} [zipCode]
                 * @config {String} [city]
                 * @config {String} [email]
                 * @config {String} [phone]
                 */
                update: function (customer) {
                    return update(customer);
                },

                setting: seaCustomerSetting,
                dispatchTime: seaCustomerDispatchTime
            };
    }]);
})();
},{}],18:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerDispatchTime', ['SeaRequest',
    function seaCustomerDispatchTime(SeaRequest) {
            var request = new SeaRequest('customer/dispatchTime/{dtId}');

            function create(params) {
                return request.post(params);
            }

            function list() {
                return request.get();
            }

            function update(dispatchTime) {
                return request.put(dispatchTime);
            }

            function destroy(dtId) {
                return request.del({
                    dtId: dtId
                });
            }

            return {
                /**
                 * create dispatchTime
                 * @param {Object} params
                 * @config {String} [name]
                 * @config {Number} [defer]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function () {
                    return list();
                },

                /**
                 * update dispatchTime
                 * @param {Object} params
                 * @config {String} [dtId]
                 * @config {String} [name]
                 * @config {Number} [defer]
                 */
                update: function (dispatchTime) {
                    return update(dispatchTime);
                },

                destroy: function (dtId) {
                    return destroy(dtId);
                }
            };
    }]);
})();
},{}],19:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerSetting', ['SeaRequest',
    function seaCustomerSetting(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/setting');

            function list(cId) {
                return request.get({
                    cId: cId
                });
            }

            function update(cId, settings) {
                settings = settings || {};
                settings.cId = cId;
                return request.put(settings);
            }

            return {
                list: function (cId) {
                    return list(cId);
                },

                /**
                 * update customer
                 * @param {String} cId
                 * @param {Object} settings
                 */
                update: function (cId, settings) {
                    return update(cId, settings);
                }
            };
    }]);
})();
},{}],20:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaGroup', ['SeaRequest', 'seaGroupSetting', 'seaGroupUser',
    function seaGroup(SeaRequest, seaGroupSetting, seaGroupUser) {
            var request = new SeaRequest('group/{gId}');

            function create(params) {
                return request.post(params);
            }

            function get(gId) {
                return request.get({
                    gId: gId
                });
            }

            function update(group) {
                return request.put(group);
            }

            function destroy(gId) {
                return request.del({
                    gId: gId
                });
            }

            return {
                /**
                 * create group
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String} [name]
                 */
                create: function (params) {
                    return create(params);
                },

                get: function (gId) {
                    return get(gId);
                },

                /**
                 * update group
                 * @param {Object} group
                 * @config {String} [gId]
                 * @config {String} [name]
                 */
                update: function (group) {
                    return update(group);
                },

                destroy: function (gId) {
                    return destroy(gId);
                },

                setting: seaGroupSetting,
                user: seaGroupUser
            };
    }]);
})();
},{}],21:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaGroupSetting', ['SeaRequest',
    function seaGroupSetting(SeaRequest) {
            var request = new SeaRequest('group/{gId}/setting');

            function list(gId) {
                return request.get({
                    gId: gId
                });
            }

            function update(gId, settings) {
                settings = settings || {};
                settings.gId = gId;
                return request.put(settings);
            }

            return {
                list: function (gId) {
                    return list(gId);
                },

                /**
                 * update group
                 * @param {String} gId
                 * @param {Object} settings
                 */
                update: function (gId, settings) {
                    return update(gId, settings);
                }
            };
    }]);
})();
},{}],22:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaGroupUser', ['SeaRequest',
    function seaGroupUser(SeaRequest) {
            var request = new SeaRequest('group/{gId}/user/{uId}');

            function list(gId) {
                return request.get({
                    gId: gId
                });
            }

            function addUser(gId, uId) {
                return request.put({
                    uId: uId,
                    gId: gId
                });
            }

            function removeUser(gId, uId) {
                return request.del({
                    uId: uId,
                    gId: gId
                });
            }

            return {
                list: function (gId) {
                    return list(gId);
                },

                /**
                 * add user to group
                 * @param {String} gId
                 * @param {String} uId
                 */
                add: function (gId, uId) {
                    return addUser(gId, uId);
                },

                /**
                 * remove user to group
                 * @param {String} gId
                 * @param {String} uId
                 */
                remove: function (gId, uId) {
                    return removeUser(gId, uId);
                }
            };
    }]);
})();
},{}],23:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMe', ['SeaRequest', 'seaMeMobilepush', 'seaMeNotification',
    function seaMe(SeaRequest, seaMeMobilepush, seaMeNotification) {
            var request = new SeaRequest('me/{action}');

            function _formatNode(node) {
                if (node.date && typeof (node.date) === 'string') {
                    node.date = new Date(node.date);
                }

                if (node.lastDate && typeof (node.lastDate) === 'string') {
                    node.lastDate = new Date(node.lastDate);
                }

                return node;
            }

            function _formatData(data) {
                var idx = data.indexOf('loadfinish');
                if (idx >= 0) {
                    data.splice(idx, 1);
                }

                for (var i = 0, len = data.length; i < len; i++) {
                    _formatNode(data[i]);
                }

                return data;
            }

            function me() {
                return request.get();
            }

            function customer() {
                return request.get({
                    action: 'customer'
                });
            }

            function feed(params) {
                params = params || {};
                params.action = 'feed';

                return request.get(params);
            }

            function key(name) {
                return request.get({
                    action: 'key',
                    name: name
                });
            }

            function nodes(params) {
                params = params || {};
                params.action = 'nodes';

                return request.get(params).then(_formatData);
            }

            return {
                me: me,
                customer: customer,
                feed: function (params) {
                    return feed(params);
                },
                key: function (name) {
                    return key(name);
                },
                nodes: function (params) {
                    return nodes(params);
                },

                mobilepush: seaMeMobilepush,
                notification: seaMeNotification
            };
    }]);
})();
},{}],24:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMeMobilepush', ['SeaRequest',
    function seaMeMobilepush(SeaRequest) {
            var request = new SeaRequest('me/mobilepush/{handle}');

            function list() {
                return request.get();
            }

            function create(params) {
                return request.post(params);
            }

            function get(handle) {
                return request.get({
                    handle: handle
                });
            }

            function destroy(handle) {
                return request.del({
                    handle: handle
                });
            }

            return {
                list: list,

                /**
                 * add mobilepush
                 * @param   {Object} params
                 * @config  {String} handle
                 * @config  {String} type
                 * @returns {Object} promise
                 */
                create: function (params) {
                    return create(params);
                },

                get: function (handle) {
                    return get(handle);
                },

                destroy: function (handle) {
                    return destroy(handle);
                }
            };
  }]);
})();
},{}],25:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMeNotification', ['SeaRequest',
    function seaMeNotification(SeaRequest) {
            var request = new SeaRequest('me/notification/{nId}');

            function list(params) {
                return request.get(params);
            }

            function update(notification) {
                return request.put(notification);
            }

            function destroy(nId) {
                return request.del({
                    nId: nId
                });
            }

            return {
                /**
                 * list all notifications
                 * @param   {Object} params
                 * @config  {Boolean}  includeGroups
                 * @returns {Object} promise
                 */
                list: function (params) {
                    return list(params);
                },

                /**
                 * update notification
                 * @param {Object} params
                 * @config {String} [nId]
                 * @config {String} [cId || aId]
                 * @config {Boolean} [mail]
                 * @config {Boolean} [phone]
                 * @config {Boolean} [ticket]
                 * @config {String} [deferId]
                 */
                update: function (notification) {
                    return get(notification);
                },

                destroy: function (nId) {
                    return destroy(nId);
                }
            };
    }]);
})();
},{}],26:[function(require,module,exports){
(function () {
    "use strict";
    
    angular.module('ngSeApi', []);

    angular.module('ngSeApi').config(['seaConfigProvider', function (seaApiConfigProvider) {
        
    }]);
})();

},{}],27:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('SeaRequest', ['seaConfig', '$q', '$http',
    function SeaRequest(seaConfig, $q, $http) {
            function SeaRequest(urlPath) {
                this.urlPath = urlPath;
            }

            /**
             * Merges url and params to a valid api url path.
             *
             * <pre><code>
             * url = '/agent/:aId'
             * params = { aId: 'test-agent-id', name: 'test agent' }
             *
             * url = formatUrl(urlPath, params)
             * url == '/agent/test-agent-id'
             * </pre></code>
             *
             * @param   {String} url    url template
             * @param   {Object} params request parameters
             * @returns {String}
             */
            SeaRequest.prototype.formatUrl = function formatUrl(url, params) {
                params = params || {};

                var keys = Object.keys(params),
                    i = keys.length;

                while (i--) {
                    var regex = new RegExp('\\{' + keys[i] + '\\}', 'gm');
                    if (regex.test(url)) {
                        url = url.replace(regex, params[keys[i]]);
                        delete params[keys[i]];
                    }
                }

                url = url.replace(/\/{[a-z0-9]*}$/i, '');

                return url;
            }

            SeaRequest.prototype.send = function send(method, params, urlPath) {
                var fullUrl = seaConfig.getUrl(urlPath || this.urlPath),
                    deferred = $q.defer(),
                    conf = {
                        method: method
                    };

                params = angular.copy(params);
                conf.url = this.formatUrl(fullUrl, params);

                if (method === 'POST' || method === 'PUT') {
                    conf.data = params || {};
                } else {
                    conf.params = params || {};
                }

                $http(conf).then(function (resp) {
                    deferred.resolve(resp.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            /**
             * perform GET request
             * @param {Object}  params  The request parameters
             * @param {String}  urlPath only append if url is different to classes urlPath
             * @returns {Boolean} promise
             */
            SeaRequest.prototype.get = function get(params, urlPath) {
                return this.send('GET', params, urlPath);
            }

            /**
             * perform POST request
             * @param {Object}  params  The request parameters
             * @param {String}  urlPath only append if url is different to classes urlPath
             * @returns {Boolean} promise
             */
            SeaRequest.prototype.post = function get(params, urlPath) {
                return this.send('POST', params, urlPath);
            }

            /**
             * perform PUT request
             * @param {Object}  params  The request parameters
             * @param {String}  urlPath only append if url is different to classes urlPath
             * @returns {Boolean} promise
             */
            SeaRequest.prototype.put = function get(params, urlPath) {
                return this.send('PUT', params, urlPath);
            }

            /**
             * perform DELETE request
             * @param {Object}  params  The request parameters
             * @param {String}  urlPath only append if url is different to classes urlPath
             * @returns {Boolean} promise
             */
            SeaRequest.prototype.del = function get(params, urlPath) {
                return this.send('DELETE', params, urlPath);
            }

            return SeaRequest;
    }]);
})();
},{}],28:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaUserGroup', ['SeaRequest',
    function seaUserGroup(SeaRequest) {
            var request = new SeaRequest('user/{uId}/group/{gId}');

            function list(uId) {
                return request.get({
                    uId: uId
                });
            }

            function addUser(uId, gId) {
                return request.put({
                    uId: uId,
                    gId: gId
                });
            }

            function removeUser(uId, gId) {
                return request.del({
                    uId: uId,
                    gId: gId
                });
            }

            return {
                list: function (uId) {
                    return list(uId);
                },

                /**
                 * add user to group
                 * @param {String} gId
                 * @param {String} uId
                 */
                add: function (uId, gId) {
                    return addUser(uId, gId);
                },

                /**
                 * remove user to group
                 * @param {String} gId
                 * @param {String} uId
                 */
                remove: function (uId, gId) {
                    return removeUser(uId, gId);
                }
            };
    }]);
})();
},{}],29:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaUserSetting', ['SeaRequest',
    function seaUserSetting(SeaRequest) {
            var request = new SeaRequest('user/{uId}/setting');

            function list(uId) {
                return request.get({
                    uId: uId
                });
            }

            function update(uId, settings) {
                settings = settings || {};
                settings.uId = uId;
                return request.put(settings);
            }

            return {
                list: function (uId) {
                    return list(uId);
                },

                /**
                 * update user
                 * @param {String} uId
                 * @param {Object} settings
                 */
                update: function (uId, settings) {
                    return update(uId, settings);
                }
            };
    }]);
})();
},{}],30:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaUserSubstitude', ['SeaRequest',
    function seaUserSubstitude(SeaRequest) {
            var request = new SeaRequest('user/{uId}/substitude/{substitudeId}');

            function set(uId, substId) {
                return request.put({
                    uId: uId,
                    substitudeId: substId
                });
            }

            function remove(uId) {
                return request.del({
                    uId: uId
                });
            }

            return {
                /**
                 * set a substitude
                 * @param {String} gId
                 * @param {String} uId
                 */
                set: function (uId, substId) {
                    return set(uId, substId);
                },

                /**
                 * remove substitude
                 * @param {String} uId
                 */
                remove: function (uId) {
                    return remove(uId);
                }
            };
    }]);
})();
},{}],31:[function(require,module,exports){
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaUser', ['SeaRequest', 'seaUserGroup', 'seaUserSetting', 'seaUserSubstitude',
    function seaUser(SeaRequest, seaUserGroup, seaUserSetting, seaUserSubstitude) {
            var request = new SeaRequest('user/{uId}');

            function create(params) {
                return request.post(params);
            }

            function get(uId) {
                return request.get({
                    uId: uId
                });
            }

            function update(user) {
                return request.put(user);
            }

            function destroy(uId) {
                return request.del({
                    uId: uId
                });
            }

            function search(params) {
                return request.get(params);
            }

            return {
                /**
                 * create user
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String} [prename]
                 * @config {String} [surname]
                 * @config {String} [email]
                 * @config {Number} [role]
                 * @config {String} [phone]
                 */
                create: function (params) {
                    return create(params);
                },

                get: function (gId) {
                    return get(gId);
                },

                /**
                 * update user
                 * @param {Object} user
                 * @config {String} [customerId]
                 * @config {String} [prename]
                 * @config {String} [surname]
                 * @config {String} [email]
                 * @config {Number} [role]
                 * @config {String} [phone]
                 */
                update: function (user) {
                    return update(user);
                },

                destroy: function (uId) {
                    return destroy(uId);
                },

                /**
                 * search users
                 * @param   {Object}   params
                 * @config  {String}   [query]
                 * @config  {String}   [customerId]
                 * @config  {Boolean}  [includeLocation]
                 */
                search: function (params) {
                    return search(params);
                },

                setting: seaUserSetting,
                group: seaUserGroup,
                substitude: seaUserSubstitude
            };
    }]);
})();
},{}]},{},[26,9,27,1,2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,19,18,23,24,25,20,21,22,31,29,28,30])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIi4uXFxhZ2VudFxcYWdlbnQuanMiLCIuLlxcYWdlbnRcXG1pc2MuanMiLCIuLlxcYWdlbnRcXG5vdGUuanMiLCIuLlxcYWdlbnRcXG5vdGlmaWNhdGlvbi5qcyIsIi4uXFxhZ2VudFxcc2V0dGluZy5qcyIsIi4uXFxhZ2VudFxcc3RhdGUuanMiLCIuLlxcYWdlbnRcXHR5cGUuanMiLCIuLlxcYXV0aFxcYXV0aC5qcyIsIi4uXFxjb25maWcuanMiLCIuLlxcY29udGFpbmVyXFxjb250YWluZXIuanMiLCIuLlxcY29udGFpbmVyXFxtaXNjLmpzIiwiLi5cXGNvbnRhaW5lclxcbm90ZS5qcyIsIi4uXFxjb250YWluZXJcXG5vdGlmaWNhdGlvbi5qcyIsIi4uXFxjb250YWluZXJcXHByb3Bvc2FsLmpzIiwiLi5cXGNvbnRhaW5lclxcc3RhdGUuanMiLCIuLlxcY29udGFpbmVyXFx0ZW1wbGF0ZS5qcyIsIi4uXFxjdXN0b21lclxcY3VzdG9tZXIuanMiLCIuLlxcY3VzdG9tZXJcXGRpc3BhdGNoVGltZS5qcyIsIi4uXFxjdXN0b21lclxcc2V0dGluZy5qcyIsIi4uXFxncm91cFxcZ3JvdXAuanMiLCIuLlxcZ3JvdXBcXHNldHRpbmcuanMiLCIuLlxcZ3JvdXBcXHVzZXIuanMiLCIuLlxcbWVcXG1lLmpzIiwiLi5cXG1lXFxtb2JpbGVwdXNoLmpzIiwiLi5cXG1lXFxub3RpZmljYXRpb24uanMiLCIuLlxcbW9kdWxlLmpzIiwiLi5cXHJlcXVlc3QuanMiLCIuLlxcdXNlclxcZ3JvdXAuanMiLCIuLlxcdXNlclxcc2V0dGluZy5qcyIsIi4uXFx1c2VyXFxzdWJzdGl0dWRlLmpzIiwiLi5cXHVzZXJcXHVzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUFnZW50JywgWydTZWFSZXF1ZXN0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NlYUFnZW50Tm90ZScsICdzZWFBZ2VudE5vdGlmaWNhdGlvbicsICdzZWFBZ2VudE1pc2MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc2VhQWdlbnRTZXR0aW5nJywgJ3NlYUFnZW50U3RhdGUnLCAnc2VhQWdlbnRUeXBlJyxcclxuICAgIGZ1bmN0aW9uIHNlYUFnZW50KFNlYVJlcXVlc3QsIHNlYUFnZW50Tm90ZSwgc2VhQWdlbnROb3RpZmljYXRpb24sIHNlYUFnZW50TWlzYywgc2VhQWdlbnRTZXR0aW5nLCBzZWFBZ2VudFN0YXRlLCBzZWFBZ2VudFR5cGUpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnYWdlbnQve2FJZH0nKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZShwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0KGFJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcclxuICAgICAgICAgICAgICAgICAgICBhSWQ6IGFJZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZShhZ2VudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KGFnZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZGVzdHJveShhSWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmRlbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgYUlkOiBhSWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBjcmVhdGUgYWdlbnRcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3BhcmVudElkXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbdHlwZV1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZShwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNvcHk6IHNlYUFnZW50TWlzYy5jb3B5LFxyXG5cclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKGFJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXQoYUlkKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiB1cGRhdGUgYWdlbnRcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhZ2VudFxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbYUlkXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbmFtZV1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW2ludGVydmFsXVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChhZ2VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGUoYWdlbnQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoYUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3koYUlkKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbm90ZTogc2VhQWdlbnROb3RlLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9ubG9nOiBzZWFBZ2VudE1pc2MuYWN0aW9ubG9nLFxyXG4gICAgICAgICAgICAgICAgY2hhcnQ6IHNlYUFnZW50TWlzYy5jaGFydCxcclxuICAgICAgICAgICAgICAgIG5vdGlmaWNhdGlvbjogc2VhQWdlbnROb3RpZmljYXRpb24sXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nOiBzZWFBZ2VudFNldHRpbmcsXHJcbiAgICAgICAgICAgICAgICBzdGF0ZTogc2VhQWdlbnRTdGF0ZSxcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBzZWFBZ2VudE1pc2MuY2F0ZWdvcnksXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBzZWFBZ2VudFR5cGVcclxuICAgICAgICAgICAgfTtcclxuICAgIH1dKTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFBZ2VudE1pc2MnLCBbJ1NlYVJlcXVlc3QnLFxyXG4gICAgZnVuY3Rpb24gc2VhQWdlbnRNaXNjKFNlYVJlcXVlc3QpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnYWdlbnQve2FJZH0ve2FjdGlvbn0nKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RBY3Rpb25sb2coYUlkLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5hSWQgPSBhSWQ7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMuYWN0aW9uID0gJ2FjdGlvbmxvZyc7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQocGFyYW1zKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0Q2hhcnQoYUlkLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5hSWQgPSBhSWQ7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMuYWN0aW9uID0gJ2NoYXJ0JztcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldChwYXJhbXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjb3B5KGFJZCwgcGFyZW50SWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7fTtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5hSWQgPSBhSWQ7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMucGFyZW50SWQgPSBwYXJlbnRJZDtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5hY3Rpb24gPSAnY29weSc7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RDYXRlZ29yaWVzKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHt9LCAnYWdlbnQvY2F0ZWdvcnknKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbmxvZzoge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIGxpc3QgYWN0aW9uIGxvZyBlbnRyaWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICAge1N0cmluZ30gYUlkICAgIGFnZW50IGlkXHJcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICAge09iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgICAgICAgICAgICAgICogQGNvbmZpZyAge051bWJlcn0gc3RhcnRcclxuICAgICAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7TnVtYmVyfSBsaW1pdFxyXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHByb21pc2VcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoYUlkLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RBY3Rpb25sb2coYUlkLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjaGFydDoge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIGdldCBjaGFydCBjb25maWcgYW5kIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAgIHtTdHJpbmd9IGFJZCAgICBhZ2VudCBpZFxyXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAgIHtPYmplY3R9IHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtOdW1iZXJ9IHN0YXJ0XHJcbiAgICAgICAgICAgICAgICAgICAgICogQGNvbmZpZyAge051bWJlcn0gbGltaXRcclxuICAgICAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7TnVtYmVyfSB2YWx1ZVR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBwcm9taXNlXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoYUlkLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldENoYXJ0KGFJZCwgcGFyYW1zKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0OiBsaXN0Q2F0ZWdvcmllc1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogY29weSBhZ2VudCB0byBhIHBhcmVudFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICAge1N0cmluZ30gYUlkXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgIHBhcmVudElkXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBwcm9taXNlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNvcHk6IGZ1bmN0aW9uIChhSWQsIHBhcmVudElkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvcHkoYUlkLCBwYXJlbnRJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQWdlbnROb3RlJywgWydTZWFSZXF1ZXN0JyxcclxuICAgIGZ1bmN0aW9uIHNlYUFnZW50Tm90ZShTZWFSZXF1ZXN0KSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2FnZW50L3thSWR9L25vdGUve25JZH0nKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGZvcm1hdE5vdGUobm90ZSkge1xyXG4gICAgICAgICAgICAgICAgbm90ZS5wb3N0ZWRPbiA9IG5ldyBEYXRlKG5vdGUucG9zdGVkT24pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vdGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZShwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKS50aGVuKGZvcm1hdE5vdGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0KGFJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcclxuICAgICAgICAgICAgICAgICAgICBhSWQ6IGFJZFxyXG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAobm90ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobm90ZXMsIGZvcm1hdE5vdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm90ZXM7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZGVzdHJveShhSWQsIG5JZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcclxuICAgICAgICAgICAgICAgICAgICBhSWQ6IGFJZCxcclxuICAgICAgICAgICAgICAgICAgICBuSWQ6IG5JZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIGNyZWF0ZSBhZ2VudCBub3RlXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFthSWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFttZXNzYWdlXVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlKHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChhSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdChhSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoYUlkLCBuSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveShhSWQsIG5JZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQWdlbnROb3RpZmljYXRpb24nLCBbJ1NlYVJlcXVlc3QnLFxuICAgIGZ1bmN0aW9uIHNlYUFnZW50Tml0aWZpY2F0aW9uKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2FnZW50L3thSWR9L25vdGlmaWNhdGlvbi97bklkfScpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGUocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGUobm90aWZpY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KG5vdGlmaWNhdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QoYUlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgYUlkOiBhSWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZGVzdHJveShhSWQsIG5JZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmRlbCh7XG4gICAgICAgICAgICAgICAgICAgIGFJZDogYUlkLFxuICAgICAgICAgICAgICAgICAgICBuSWQ6IG5JZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIGNyZWF0ZSBub3RpZmljYXRpb25cbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbYUlkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3VzZXJJZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbbWFpbF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbcGhvbmVdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW3RpY2tldF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtkZWZlcklkXVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIHVwZGF0ZSBub3RpZmljYXRpb25cbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbklkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2FJZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFt1c2VySWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW21haWxdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW3Bob25lXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFt0aWNrZXRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbZGVmZXJJZF1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShub3RpZmljYXRpb24pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoYUlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KGFJZCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIChhSWQsIG5JZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveShhSWQsIG5JZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUFnZW50U2V0dGluZycsIFsnU2VhUmVxdWVzdCcsXG4gICAgZnVuY3Rpb24gc2VhQWdlbnRTZXR0aW5nKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2FnZW50L3thSWR9L3NldHRpbmcve2tleX0nKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKHNldHRpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQocGFyYW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdChhSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICBhSWQ6IGFJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIGNyZWF0ZSBhZ2VudCBub3RlXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2FJZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtrZXldXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbdmFsdWVdXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAoc2V0dGluZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlKHNldHRpbmcpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoYUlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KGFJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUFnZW50U3RhdGUnLCBbJ1NlYVJlcXVlc3QnLFxuICAgIGZ1bmN0aW9uIHNlYUFnZW50U3RhdGUoU2VhUmVxdWVzdCkge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnYWdlbnQve2FJZH0vc3RhdGUnKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gZm9ybWF0U3RhdGUoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5kYXRlID0gbmV3IERhdGUoc3RhdGUuZGF0ZSk7XG4gICAgICAgICAgICAgICAgc3RhdGUubGFzdERhdGUgPSBuZXcgRGF0ZShzdGF0ZS5sYXN0RGF0ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBoaW50KHNldHRpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QoYUlkLCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgICAgICAgICAgcGFyYW1zLmFJZCA9IGFJZDtcblxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocGFyYW1zLmFJZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMsICdhZ2VudC9zdGF0ZScpLnRoZW4oZnVuY3Rpb24gKHN0YXRlc0J5SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChPYmplY3Qua2V5cyhzdGF0ZXNCeUlkKSwgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChzdGF0ZXNCeUlkW2tleV0sIGZvcm1hdFN0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGVzQnlJZDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldChwYXJhbXMpLnRoZW4oZnVuY3Rpb24gKHN0YXRlcykge1xuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goc3RhdGVzLCBmb3JtYXRTdGF0ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlcztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBjcmVhdGUgYWdlbnQgc3RhdGUgaGludFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFthSWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbc0lkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2F1dGhvcl1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtoaW50VHlwZV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFttZXNzYWdlXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2Fzc2lnbmVkVXNlcl1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtBcnJheX0gW21lbnRpb25lZFVzZXJzXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFtwcml2YXRlXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW3VudGlsXVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGhpbnQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhpbnQocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogbGlzdCBhZ2VudCBzdGF0ZXNcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgIGFJZFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW2xpbWl0XVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW3N0YXJ0XVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW2VuZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbaW5jbHVkZUhpbnRzXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFtpbmNsdWRlUmF3RGF0YV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtmb3JtYXRdXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGFJZCwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KGFJZCwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQWdlbnRUeXBlJywgWydTZWFSZXF1ZXN0JyxcbiAgICBmdW5jdGlvbiBzZWFBZ2VudFR5cGUoU2VhUmVxdWVzdCkge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnYWdlbnQvdHlwZScpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0U2V0dGluZ3MoYWtJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgICAgIGFrSWQ6IGFrSWRcbiAgICAgICAgICAgICAgICB9LCAnYWdlbnQvdHlwZS97YWtJZH0vc2V0dGluZycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNldHRpbmc6IHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIGxpc3Qgc2V0dGluZ3Mgb2YgYW4gYWdlbnQgdHlwZVxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2FrSWRdXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoYWtJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RTZXR0aW5ncyhha0lkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBsaXN0OiBsaXN0XG4gICAgICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQXV0aCcsIFsnU2VhUmVxdWVzdCcsXG4gICAgZnVuY3Rpb24gc2VhQXV0aChTZWFSZXF1ZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdhdXRoL3thY3Rpb259Jyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUFwaUtleShwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgICAgICAgICAgcGFyYW1zLmFjdGlvbiA9ICdrZXknO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBsb2dpbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgICAgICAgICAgcGFyYW1zLmFjdGlvbiA9ICdsb2dpbic7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvZ291dChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgICAgICAgICAgcGFyYW1zLmFjdGlvbiA9ICdsb2dvdXQnO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogY3JlYXRlIGFwaUtleVxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtlbWFpbF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtwYXNzd29yZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFt0eXBlXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW3ZhbGlkVW50aWxdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbbWF4VXNlc11cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBjcmVhdGVBcGlLZXk6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUFwaUtleShwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBsb2dpblxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFthcGlLZXldXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbZW1haWxdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbcGFzc3dvcmRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW2NyZWF0ZUFwaUtleV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFthcGlLZXlOYW1lXVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGxvZ2luOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsb2dpbihwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBsb2dvdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvZ291dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgfV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5wcm92aWRlcignc2VhQ29uZmlnJywgWyckaHR0cFByb3ZpZGVyJywgZnVuY3Rpb24gU2VhQ29uZmlnUHJvdmlkZXIoJGh0dHBQcm92aWRlcikge1xyXG4gICAgICAgIHZhciBjb25maWcgPSB7XHJcbiAgICAgICAgICAgIGJhc2VVcmw6ICdodHRwczovL2FwaS5zZXJ2ZXItZXllLmRlJyxcclxuICAgICAgICAgICAgYXBpVmVyc2lvbjogMixcclxuICAgICAgICAgICAgYXBpS2V5OiBudWxsLFxyXG4gICAgICAgICAgICBnZXRVcmw6IGZ1bmN0aW9uIChwYXRoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW3RoaXMuYmFzZVVybCwgdGhpcy5hcGlWZXJzaW9uLCBwYXRoXS5qb2luKCcvJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICdyZXF1ZXN0JzogZnVuY3Rpb24gKHJlcUNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25maWcuYXBpS2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcUNvbmZpZy5oZWFkZXJzWyd4LWFwaS1rZXknXSA9IGNvbmZpZy5hcGlLZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVxQ29uZmlnO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAncmVzcG9uc2UnOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0QmFzZVVybCA9IGZ1bmN0aW9uIChiYXNlVXJsKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZy5iYXNlVXJsID0gYmFzZVVybDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0QXBpVmVyc2lvbiA9IGZ1bmN0aW9uIChhcGlWZXJzaW9uKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZy5hcGlWZXJzaW9uID0gYXBpVmVyc2lvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0QXBpS2V5ID0gZnVuY3Rpb24gKGFwaUtleSkge1xyXG4gICAgICAgICAgICBjb25maWcuYXBpS2V5ID0gYXBpS2V5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24gKCRodHRwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBnZXRCYXNlVXJsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy5iYXNlVXJsO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGdldEFwaVZlcnNpb246IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnLmFwaVZlcnNpb247XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZ2V0QXBpS2V5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy5hcGlLZXk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0QXBpS2V5OiBmdW5jdGlvbiAoYXBpS2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLmFwaUtleSA9IGFwaUtleTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBnZXRVcmw6IGZ1bmN0aW9uIChwYXRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtjb25maWcuYmFzZVVybCwgY29uZmlnLmFwaVZlcnNpb24sIHBhdGhdLmpvaW4oJy8nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQ29udGFpbmVyJywgWydTZWFSZXF1ZXN0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzZWFDb250YWluZXJNaXNjJywgJ3NlYUNvbnRhaW5lck5vdGUnLCAnc2VhQ29udGFpbmVyTm90aWZpY2F0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzZWFDb250YWluZXJQcm9wb3NhbCcsICdzZWFDb250YWluZXJTdGF0ZScsICdzZWFDb250YWluZXJUZW1wbGF0ZScsXG4gICAgZnVuY3Rpb24gc2VhQ29udGFpbmVyKFNlYVJlcXVlc3QsIHNlYUNvbnRhaW5lck1pc2MsIHNlYUNvbnRhaW5lck5vdGUsIHNlYUNvbnRhaW5lck5vdGlmaWNhdGlvbiwgc2VhQ29udGFpbmVyUHJvcG9zYWwsIHNlYUNvbnRhaW5lclN0YXRlLCBzZWFDb250YWluZXJUZW1wbGF0ZSkge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnY29udGFpbmVyL3tjSWR9Jyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldChjSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICBjSWQ6IGNJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGUoY29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KGNvbnRhaW5lcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koY0lkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcbiAgICAgICAgICAgICAgICAgICAgY0lkOiBjSWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChjSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldChjSWQpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiB1cGRhdGUgY29udGFpbmVyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRhaW5lclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2NJZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtuYW1lXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFthbGVydE9mZmxpbmVdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW2FsZXJ0U2h1dGRvd25dXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbbWF4SGVhcnRiZWF0VGltZW91dF1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShjb250YWluZXIpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoY0lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXN0cm95KGNJZCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGFjdGlvbmxvZzogc2VhQ29udGFpbmVyTWlzYy5hY3Rpb25sb2csXG4gICAgICAgICAgICAgICAgaW52ZW50b3J5OiBzZWFDb250YWluZXJNaXNjLmludmVudG9yeSxcbiAgICAgICAgICAgICAgICBub3RlOiBzZWFDb250YWluZXJOb3RlLFxuICAgICAgICAgICAgICAgIG5vdGlmaWNhdGlvbjogc2VhQ29udGFpbmVyTm90aWZpY2F0aW9uLFxuICAgICAgICAgICAgICAgIHBjdmlzaXQ6IHNlYUNvbnRhaW5lck1pc2MucGN2aXNpdCxcbiAgICAgICAgICAgICAgICBwcm9wb3NhbDogc2VhQ29udGFpbmVyUHJvcG9zYWwsXG4gICAgICAgICAgICAgICAgc3RhdGU6IHNlYUNvbnRhaW5lclN0YXRlLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBzZWFDb250YWluZXJUZW1wbGF0ZVxuICAgICAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUNvbnRhaW5lck1pc2MnLCBbJ1NlYVJlcXVlc3QnLFxuICAgIGZ1bmN0aW9uIHNlYUNvbnRhaW5lck1pc2MoU2VhUmVxdWVzdCkge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnY29udGFpbmVyL3tjSWR9L3thY3Rpb259Jyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RBY3Rpb25sb2coY0lkLCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgICAgICAgICAgcGFyYW1zLmNJZCA9IGNJZDtcbiAgICAgICAgICAgICAgICBwYXJhbXMuYWN0aW9uID0gJ2FjdGlvbmxvZyc7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldEludmVudG9yeShjSWQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgICAgICAgICBwYXJhbXMuY0lkID0gY0lkO1xuICAgICAgICAgICAgICAgIHBhcmFtcy5hY3Rpb24gPSAnaW52ZW50b3J5JztcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQocGFyYW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gY29ubmVjdFBjdmlzaXQoY0lkLCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgICAgICAgICAgcGFyYW1zLmNJZCA9IGNJZDtcbiAgICAgICAgICAgICAgICBwYXJhbXMuYWN0aW9uID0gJ3BjdmlzaXQnO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldChwYXJhbXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGFjdGlvbmxvZzoge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogbGlzdCBhY3Rpb24gbG9nIGVudHJpZXNcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICAge1N0cmluZ30gY0lkXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAgIHtPYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7TnVtYmVyfSBbc3RhcnRdXG4gICAgICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtOdW1iZXJ9IFtsaW1pdF1cbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybnMge09iamVjdH0gcHJvbWlzZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGNJZCwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdEFjdGlvbmxvZyhjSWQsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgaW52ZW50b3J5OiB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBnZXQgaW52ZW50b3J5IG9mIHRoZSBjb250YWluZXJcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICAge1N0cmluZ30gICBjSWRcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICAge1N0cmluZ30gICBwYXJhbXNcbiAgICAgICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbZm9ybWF0XVxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBwcm9taXNlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChjSWQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldEludmVudG9yeShjSWQsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHBjdmlzaXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIGluc3RhbGwgYW5kIGNvbm5lY3QgdG8gcGN2aXNpdFxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSBjSWRcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICAge09iamVjdH0gICBwYXJhbXNcbiAgICAgICAgICAgICAgICAgICAgICogQGNvbmZpZyAge1N0cmluZ30gICBbc3VwcG9ydGVySWRdXG4gICAgICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtTdHJpbmd9ICAgW3N1cHBvcnRlclBhc3N3b3JkXVxuICAgICAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7U3RyaW5nfSAgIFt1c2VyXVxuICAgICAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7U3RyaW5nfSAgIFtwYXNzd29yZF1cbiAgICAgICAgICAgICAgICAgICAgICogQGNvbmZpZyAge1N0cmluZ30gICBbZG9tYWluXVxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBwcm9taXNlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBjb25uZWN0OiBmdW5jdGlvbiAoY0lkLCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25uZWN0UGN2aXNpdChjSWQsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQ29udGFpbmVyTm90ZScsIFsnU2VhUmVxdWVzdCcsXG4gICAgZnVuY3Rpb24gc2VhQ29udGFpbmVyTm90ZShTZWFSZXF1ZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdjb250YWluZXIve2NJZH0vbm90ZS97bklkfScpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBmb3JtYXROb3RlKG5vdGUpIHtcbiAgICAgICAgICAgICAgICBub3RlLnBvc3RlZE9uID0gbmV3IERhdGUobm90ZS5wb3N0ZWRPbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vdGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZShwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcykudGhlbihmb3JtYXROb3RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdChjSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICBjSWQ6IGNJZFxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKG5vdGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChub3RlcywgZm9ybWF0Tm90ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vdGVzO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBkZXN0cm95KGNJZCwgbklkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcbiAgICAgICAgICAgICAgICAgICAgYUlkOiBjSWQsXG4gICAgICAgICAgICAgICAgICAgIG5JZDogbklkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogY3JlYXRlIG5vdGVcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbY0lkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW21lc3NhZ2VdXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGNJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdChjSWQpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoY0lkLCBuSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3koY0lkLCBuSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgfV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFDb250YWluZXJOb3RpZmljYXRpb24nLCBbJ1NlYVJlcXVlc3QnLFxuICAgIGZ1bmN0aW9uIHNlYUNvbnRhaW5lck5vdGlmaWNhdGlvbihTZWFSZXF1ZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdjb250YWluZXIve2NJZH0vbm90aWZpY2F0aW9uL3tuSWR9Jyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZShwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZShub3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQobm90aWZpY2F0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdChjSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICBjSWQ6IGNJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBkZXN0cm95KGNJZCwgbklkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcbiAgICAgICAgICAgICAgICAgICAgY0lkOiBjSWQsXG4gICAgICAgICAgICAgICAgICAgIG5JZDogbklkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogY3JlYXRlIG5vdGlmaWNhdGlvblxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjSWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbdXNlcklkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFttYWlsXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFtwaG9uZV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbdGlja2V0XVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2RlZmVySWRdXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogdXBkYXRlIG5vdGlmaWNhdGlvblxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtuSWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbY0lkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3VzZXJJZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbbWFpbF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbcGhvbmVdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW3RpY2tldF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtkZWZlcklkXVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKG5vdGlmaWNhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlKG5vdGlmaWNhdGlvbik7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChjSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoY0lkKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKGNJZCwgbklkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXN0cm95KGNJZCwgbklkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQ29udGFpbmVyUHJvcG9zYWwnLCBbJ1NlYVJlcXVlc3QnLFxuICAgIGZ1bmN0aW9uIHNlYUNvbnRhaW5lclByb3Bvc2FsKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2NvbnRhaW5lci97Y0lkfS9wcm9wb3NhbC97cElkfScpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBhY2NlcHQoY0lkLCBwSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQoe1xuICAgICAgICAgICAgICAgICAgICBjSWQ6IGNJZCxcbiAgICAgICAgICAgICAgICAgICAgcElkOiBwSWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdChjSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICBjSWQ6IGNJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBkZW55KGNJZCwgcElkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcbiAgICAgICAgICAgICAgICAgICAgY0lkOiBjSWQsXG4gICAgICAgICAgICAgICAgICAgIHBJZDogcElkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RTZXR0aW5ncyhjSWQsIHBJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgICAgIGNJZDogY0lkLFxuICAgICAgICAgICAgICAgICAgICBwSWQ6IHBJZFxuICAgICAgICAgICAgICAgIH0sICdjb250YWluZXIve2NJZH0vcHJvcG9zYWwve3BJZH0vc2V0dGluZycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGFjY2VwdDogZnVuY3Rpb24gKGNJZCwgcElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2NlcHQoY0lkLCBwSWQpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoY0lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KGNJZCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGRlbnk6IGZ1bmN0aW9uIChjSWQsIHBJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVueShjSWQsIHBJZCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChjSWQsIHBJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RTZXR0aW5ncyhjSWQsIHBJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQ29udGFpbmVyU3RhdGUnLCBbJ1NlYVJlcXVlc3QnLFxuICAgIGZ1bmN0aW9uIHNlYUNvbnRhaW5lclN0YXRlKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2NvbnRhaW5lci97Y0lkfS9zdGF0ZScpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBmb3JtYXRTdGF0ZShzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmRhdGUgPSBuZXcgRGF0ZShzdGF0ZS5kYXRlKTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5sYXN0RGF0ZSA9IG5ldyBEYXRlKHN0YXRlLmxhc3REYXRlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGhpbnQoc2V0dGluZykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdChjSWQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgICAgICAgICBwYXJhbXMuY0lkID0gY0lkO1xuXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwYXJhbXMuY0lkKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcywgJ2NvbnRhaW5lci9zdGF0ZScpLnRoZW4oZnVuY3Rpb24gKHN0YXRlc0J5SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChPYmplY3Qua2V5cyhzdGF0ZXNCeUlkKSwgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChzdGF0ZXNCeUlkW2tleV0sIGZvcm1hdFN0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcykudGhlbihmdW5jdGlvbiAoc3RhdGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChzdGF0ZXMsIGZvcm1hdFN0YXRlKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGVzO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIGNyZWF0ZSBjb250YWluZXIgc3RhdGUgaGludFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjSWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbc0lkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2F1dGhvcl1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtoaW50VHlwZV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFttZXNzYWdlXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2Fzc2lnbmVkVXNlcl1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtBcnJheX0gW21lbnRpb25lZFVzZXJzXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFtwcml2YXRlXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW3VudGlsXVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGhpbnQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhpbnQocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogbGlzdCBjb250YWluZXIgc3RhdGVzXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICAge1N0cmluZ30gICBjSWRcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtsaW1pdF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtzdGFydF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtlbmRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW2luY2x1ZGVIaW50c11cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbaW5jbHVkZVJhd0RhdGFdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbZm9ybWF0XVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChjSWQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdChjSWQsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUNvbnRhaW5lclRlbXBsYXRlJywgWydTZWFSZXF1ZXN0JyxcbiAgICBmdW5jdGlvbiBzZWFDb250YWluZXJUZW1wbGF0ZShTZWFSZXF1ZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdjb250YWluZXIve2NJZH0vdGVtcGxhdGUve3RJZH0nKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlKGNJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3Qoe1xuICAgICAgICAgICAgICAgICAgICBjSWQ6IGNJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBhc3NpZ24oY0lkLCB0SWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHtcbiAgICAgICAgICAgICAgICAgICAgY0lkOiBjSWQsXG4gICAgICAgICAgICAgICAgICAgIHRJZDogdElkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogY3JlYXRlIHRlbXBsYXRlIGZvcm0gc3lzdGVtXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGNJZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKGNJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlKGNJZCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIGFzc2lnbiBhIHRlbXBsYXRlIHRvIGEgc3lzdGVtXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGNJZFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0SWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBhc3NpZ246IGZ1bmN0aW9uIChjSWQsIHRJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXNzaWduKGNJZCwgdElkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQ3VzdG9tZXInLCBbJ1NlYVJlcXVlc3QnLCAnc2VhQ3VzdG9tZXJTZXR0aW5nJywgJ3NlYUN1c3RvbWVyRGlzcGF0Y2hUaW1lJyxcbiAgICBmdW5jdGlvbiBzZWFDdXN0b21lcihTZWFSZXF1ZXN0LCBzZWFDdXN0b21lclNldHRpbmcsIHNlYUN1c3RvbWVyRGlzcGF0Y2hUaW1lKSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdjdXN0b21lci97Y0lkfScpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXQoY0lkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgY0lkOiBjSWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKGN1c3RvbWVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KGN1c3RvbWVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChjSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldChjSWQpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiB1cGRhdGUgY3VzdG9tZXJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gY3VzdG9tZXJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjSWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbY291bnRyeV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtjdXN0b21lck51bWJlckludGVybl1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtjdXN0b21lck51bWJlckV4dGVybl1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjb21wYW55TmFtZV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtzdHJlZXRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbemlwQ29kZV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjaXR5XVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2VtYWlsXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3Bob25lXVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKGN1c3RvbWVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGUoY3VzdG9tZXIpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBzZXR0aW5nOiBzZWFDdXN0b21lclNldHRpbmcsXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hUaW1lOiBzZWFDdXN0b21lckRpc3BhdGNoVGltZVxuICAgICAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUN1c3RvbWVyRGlzcGF0Y2hUaW1lJywgWydTZWFSZXF1ZXN0JyxcbiAgICBmdW5jdGlvbiBzZWFDdXN0b21lckRpc3BhdGNoVGltZShTZWFSZXF1ZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdjdXN0b21lci9kaXNwYXRjaFRpbWUve2R0SWR9Jyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZShwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZShkaXNwYXRjaFRpbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQoZGlzcGF0Y2hUaW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZGVzdHJveShkdElkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcbiAgICAgICAgICAgICAgICAgICAgZHRJZDogZHRJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIGNyZWF0ZSBkaXNwYXRjaFRpbWVcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbmFtZV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtkZWZlcl1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZShwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIHVwZGF0ZSBkaXNwYXRjaFRpbWVcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbZHRJZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtuYW1lXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW2RlZmVyXVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKGRpc3BhdGNoVGltZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlKGRpc3BhdGNoVGltZSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIChkdElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXN0cm95KGR0SWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgfV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFDdXN0b21lclNldHRpbmcnLCBbJ1NlYVJlcXVlc3QnLFxuICAgIGZ1bmN0aW9uIHNlYUN1c3RvbWVyU2V0dGluZyhTZWFSZXF1ZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdjdXN0b21lci97Y0lkfS9zZXR0aW5nJyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QoY0lkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgY0lkOiBjSWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKGNJZCwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHt9O1xuICAgICAgICAgICAgICAgIHNldHRpbmdzLmNJZCA9IGNJZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQoc2V0dGluZ3MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChjSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoY0lkKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogdXBkYXRlIGN1c3RvbWVyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGNJZFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKGNJZCwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShjSWQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhR3JvdXAnLCBbJ1NlYVJlcXVlc3QnLCAnc2VhR3JvdXBTZXR0aW5nJywgJ3NlYUdyb3VwVXNlcicsXG4gICAgZnVuY3Rpb24gc2VhR3JvdXAoU2VhUmVxdWVzdCwgc2VhR3JvdXBTZXR0aW5nLCBzZWFHcm91cFVzZXIpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2dyb3VwL3tnSWR9Jyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZShwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldChnSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICBnSWQ6IGdJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGUoZ3JvdXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQoZ3JvdXApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBkZXN0cm95KGdJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmRlbCh7XG4gICAgICAgICAgICAgICAgICAgIGdJZDogZ0lkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogY3JlYXRlIGdyb3VwXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2N1c3RvbWVySWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbmFtZV1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZShwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChnSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldChnSWQpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiB1cGRhdGUgZ3JvdXBcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZ3JvdXBcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtnSWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbmFtZV1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChncm91cCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlKGdyb3VwKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKGdJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveShnSWQpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBzZXR0aW5nOiBzZWFHcm91cFNldHRpbmcsXG4gICAgICAgICAgICAgICAgdXNlcjogc2VhR3JvdXBVc2VyXG4gICAgICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhR3JvdXBTZXR0aW5nJywgWydTZWFSZXF1ZXN0JyxcbiAgICBmdW5jdGlvbiBzZWFHcm91cFNldHRpbmcoU2VhUmVxdWVzdCkge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnZ3JvdXAve2dJZH0vc2V0dGluZycpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0KGdJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgICAgIGdJZDogZ0lkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZShnSWQsIHNldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB7fTtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5nSWQgPSBnSWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KHNldHRpbmdzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoZ0lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KGdJZCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIHVwZGF0ZSBncm91cFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBnSWRcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChnSWQsIHNldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGUoZ0lkLCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUdyb3VwVXNlcicsIFsnU2VhUmVxdWVzdCcsXG4gICAgZnVuY3Rpb24gc2VhR3JvdXBVc2VyKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2dyb3VwL3tnSWR9L3VzZXIve3VJZH0nKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdChnSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICBnSWQ6IGdJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBhZGRVc2VyKGdJZCwgdUlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KHtcbiAgICAgICAgICAgICAgICAgICAgdUlkOiB1SWQsXG4gICAgICAgICAgICAgICAgICAgIGdJZDogZ0lkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlbW92ZVVzZXIoZ0lkLCB1SWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xuICAgICAgICAgICAgICAgICAgICB1SWQ6IHVJZCxcbiAgICAgICAgICAgICAgICAgICAgZ0lkOiBnSWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoZ0lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KGdJZCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIGFkZCB1c2VyIHRvIGdyb3VwXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGdJZFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1SWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBhZGQ6IGZ1bmN0aW9uIChnSWQsIHVJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWRkVXNlcihnSWQsIHVJZCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIHJlbW92ZSB1c2VyIHRvIGdyb3VwXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGdJZFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1SWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIChnSWQsIHVJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVtb3ZlVXNlcihnSWQsIHVJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYU1lJywgWydTZWFSZXF1ZXN0JywgJ3NlYU1lTW9iaWxlcHVzaCcsICdzZWFNZU5vdGlmaWNhdGlvbicsXG4gICAgZnVuY3Rpb24gc2VhTWUoU2VhUmVxdWVzdCwgc2VhTWVNb2JpbGVwdXNoLCBzZWFNZU5vdGlmaWNhdGlvbikge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnbWUve2FjdGlvbn0nKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gX2Zvcm1hdE5vZGUobm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLmRhdGUgJiYgdHlwZW9mIChub2RlLmRhdGUpID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmRhdGUgPSBuZXcgRGF0ZShub2RlLmRhdGUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChub2RlLmxhc3REYXRlICYmIHR5cGVvZiAobm9kZS5sYXN0RGF0ZSkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUubGFzdERhdGUgPSBuZXcgRGF0ZShub2RlLmxhc3REYXRlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gX2Zvcm1hdERhdGEoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBpZHggPSBkYXRhLmluZGV4T2YoJ2xvYWRmaW5pc2gnKTtcbiAgICAgICAgICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBfZm9ybWF0Tm9kZShkYXRhW2ldKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gbWUoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGN1c3RvbWVyKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ2N1c3RvbWVyJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBmZWVkKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgICAgICAgICBwYXJhbXMuYWN0aW9uID0gJ2ZlZWQnO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGtleShuYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAna2V5JyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBub2RlcyhwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgICAgICAgICAgcGFyYW1zLmFjdGlvbiA9ICdub2Rlcyc7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQocGFyYW1zKS50aGVuKF9mb3JtYXREYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBtZTogbWUsXG4gICAgICAgICAgICAgICAgY3VzdG9tZXI6IGN1c3RvbWVyLFxuICAgICAgICAgICAgICAgIGZlZWQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZlZWQocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGtleTogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleShuYW1lKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG5vZGVzOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlcyhwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBtb2JpbGVwdXNoOiBzZWFNZU1vYmlsZXB1c2gsXG4gICAgICAgICAgICAgICAgbm90aWZpY2F0aW9uOiBzZWFNZU5vdGlmaWNhdGlvblxuICAgICAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYU1lTW9iaWxlcHVzaCcsIFsnU2VhUmVxdWVzdCcsXG4gICAgZnVuY3Rpb24gc2VhTWVNb2JpbGVwdXNoKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ21lL21vYmlsZXB1c2gve2hhbmRsZX0nKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0KGhhbmRsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZTogaGFuZGxlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koaGFuZGxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlOiBoYW5kbGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsaXN0OiBsaXN0LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogYWRkIG1vYmlsZXB1c2hcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7U3RyaW5nfSBoYW5kbGVcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7U3RyaW5nfSB0eXBlXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge09iamVjdH0gcHJvbWlzZVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKGhhbmRsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0KGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3koaGFuZGxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICB9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYU1lTm90aWZpY2F0aW9uJywgWydTZWFSZXF1ZXN0JyxcbiAgICBmdW5jdGlvbiBzZWFNZU5vdGlmaWNhdGlvbihTZWFSZXF1ZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdtZS9ub3RpZmljYXRpb24ve25JZH0nKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQocGFyYW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKG5vdGlmaWNhdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dChub3RpZmljYXRpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBkZXN0cm95KG5JZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmRlbCh7XG4gICAgICAgICAgICAgICAgICAgIG5JZDogbklkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogbGlzdCBhbGwgbm90aWZpY2F0aW9uc1xuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAgIHtPYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtCb29sZWFufSAgaW5jbHVkZUdyb3Vwc1xuICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHByb21pc2VcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIHVwZGF0ZSBub3RpZmljYXRpb25cbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbklkXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2NJZCB8fCBhSWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW21haWxdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW3Bob25lXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFt0aWNrZXRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbZGVmZXJJZF1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldChub3RpZmljYXRpb24pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAobklkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXN0cm95KG5JZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIFxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknLCBbXSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5jb25maWcoWydzZWFDb25maWdQcm92aWRlcicsIGZ1bmN0aW9uIChzZWFBcGlDb25maWdQcm92aWRlcikge1xyXG4gICAgICAgIFxyXG4gICAgfV0pO1xyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdTZWFSZXF1ZXN0JywgWydzZWFDb25maWcnLCAnJHEnLCAnJGh0dHAnLFxyXG4gICAgZnVuY3Rpb24gU2VhUmVxdWVzdChzZWFDb25maWcsICRxLCAkaHR0cCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBTZWFSZXF1ZXN0KHVybFBhdGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXJsUGF0aCA9IHVybFBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBNZXJnZXMgdXJsIGFuZCBwYXJhbXMgdG8gYSB2YWxpZCBhcGkgdXJsIHBhdGguXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIDxwcmU+PGNvZGU+XHJcbiAgICAgICAgICAgICAqIHVybCA9ICcvYWdlbnQvOmFJZCdcclxuICAgICAgICAgICAgICogcGFyYW1zID0geyBhSWQ6ICd0ZXN0LWFnZW50LWlkJywgbmFtZTogJ3Rlc3QgYWdlbnQnIH1cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogdXJsID0gZm9ybWF0VXJsKHVybFBhdGgsIHBhcmFtcylcclxuICAgICAgICAgICAgICogdXJsID09ICcvYWdlbnQvdGVzdC1hZ2VudC1pZCdcclxuICAgICAgICAgICAgICogPC9wcmU+PC9jb2RlPlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSB1cmwgICAgdXJsIHRlbXBsYXRlXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSAgIHtPYmplY3R9IHBhcmFtcyByZXF1ZXN0IHBhcmFtZXRlcnNcclxuICAgICAgICAgICAgICogQHJldHVybnMge1N0cmluZ31cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIFNlYVJlcXVlc3QucHJvdG90eXBlLmZvcm1hdFVybCA9IGZ1bmN0aW9uIGZvcm1hdFVybCh1cmwsIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMocGFyYW1zKSxcclxuICAgICAgICAgICAgICAgICAgICBpID0ga2V5cy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGktLSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoJ1xcXFx7JyArIGtleXNbaV0gKyAnXFxcXH0nLCAnZ20nKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVnZXgudGVzdCh1cmwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IHVybC5yZXBsYWNlKHJlZ2V4LCBwYXJhbXNba2V5c1tpXV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgcGFyYW1zW2tleXNbaV1dO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXFwve1thLXowLTldKn0kL2ksICcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBTZWFSZXF1ZXN0LnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24gc2VuZChtZXRob2QsIHBhcmFtcywgdXJsUGF0aCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZ1bGxVcmwgPSBzZWFDb25maWcuZ2V0VXJsKHVybFBhdGggfHwgdGhpcy51cmxQYXRoKSxcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZCA9ICRxLmRlZmVyKCksXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZiA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBtZXRob2RcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IGFuZ3VsYXIuY29weShwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgY29uZi51cmwgPSB0aGlzLmZvcm1hdFVybChmdWxsVXJsLCBwYXJhbXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChtZXRob2QgPT09ICdQT1NUJyB8fCBtZXRob2QgPT09ICdQVVQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uZi5kYXRhID0gcGFyYW1zIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25mLnBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkaHR0cChjb25mKS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBwZXJmb3JtIEdFVCByZXF1ZXN0XHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgcGFyYW1zICBUaGUgcmVxdWVzdCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgdXJsUGF0aCBvbmx5IGFwcGVuZCBpZiB1cmwgaXMgZGlmZmVyZW50IHRvIGNsYXNzZXMgdXJsUGF0aFxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gcHJvbWlzZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgU2VhUmVxdWVzdC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0KHBhcmFtcywgdXJsUGF0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnR0VUJywgcGFyYW1zLCB1cmxQYXRoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIHBlcmZvcm0gUE9TVCByZXF1ZXN0XHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgcGFyYW1zICBUaGUgcmVxdWVzdCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgdXJsUGF0aCBvbmx5IGFwcGVuZCBpZiB1cmwgaXMgZGlmZmVyZW50IHRvIGNsYXNzZXMgdXJsUGF0aFxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gcHJvbWlzZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgU2VhUmVxdWVzdC5wcm90b3R5cGUucG9zdCA9IGZ1bmN0aW9uIGdldChwYXJhbXMsIHVybFBhdGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ1BPU1QnLCBwYXJhbXMsIHVybFBhdGgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogcGVyZm9ybSBQVVQgcmVxdWVzdFxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gIHBhcmFtcyAgVGhlIHJlcXVlc3QgcGFyYW1ldGVyc1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gIHVybFBhdGggb25seSBhcHBlbmQgaWYgdXJsIGlzIGRpZmZlcmVudCB0byBjbGFzc2VzIHVybFBhdGhcclxuICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59IHByb21pc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIFNlYVJlcXVlc3QucHJvdG90eXBlLnB1dCA9IGZ1bmN0aW9uIGdldChwYXJhbXMsIHVybFBhdGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ1BVVCcsIHBhcmFtcywgdXJsUGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBwZXJmb3JtIERFTEVURSByZXF1ZXN0XHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgcGFyYW1zICBUaGUgcmVxdWVzdCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgdXJsUGF0aCBvbmx5IGFwcGVuZCBpZiB1cmwgaXMgZGlmZmVyZW50IHRvIGNsYXNzZXMgdXJsUGF0aFxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gcHJvbWlzZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgU2VhUmVxdWVzdC5wcm90b3R5cGUuZGVsID0gZnVuY3Rpb24gZ2V0KHBhcmFtcywgdXJsUGF0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnREVMRVRFJywgcGFyYW1zLCB1cmxQYXRoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFNlYVJlcXVlc3Q7XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhVXNlckdyb3VwJywgWydTZWFSZXF1ZXN0JyxcbiAgICBmdW5jdGlvbiBzZWFVc2VyR3JvdXAoU2VhUmVxdWVzdCkge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgndXNlci97dUlkfS9ncm91cC97Z0lkfScpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0KHVJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgICAgIHVJZDogdUlkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGFkZFVzZXIodUlkLCBnSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQoe1xuICAgICAgICAgICAgICAgICAgICB1SWQ6IHVJZCxcbiAgICAgICAgICAgICAgICAgICAgZ0lkOiBnSWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gcmVtb3ZlVXNlcih1SWQsIGdJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmRlbCh7XG4gICAgICAgICAgICAgICAgICAgIHVJZDogdUlkLFxuICAgICAgICAgICAgICAgICAgICBnSWQ6IGdJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uICh1SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QodUlkKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogYWRkIHVzZXIgdG8gZ3JvdXBcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZ0lkXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVJZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGFkZDogZnVuY3Rpb24gKHVJZCwgZ0lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhZGRVc2VyKHVJZCwgZ0lkKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogcmVtb3ZlIHVzZXIgdG8gZ3JvdXBcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZ0lkXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVJZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHJlbW92ZTogZnVuY3Rpb24gKHVJZCwgZ0lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZW1vdmVVc2VyKHVJZCwgZ0lkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhVXNlclNldHRpbmcnLCBbJ1NlYVJlcXVlc3QnLFxuICAgIGZ1bmN0aW9uIHNlYVVzZXJTZXR0aW5nKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ3VzZXIve3VJZH0vc2V0dGluZycpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0KHVJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XG4gICAgICAgICAgICAgICAgICAgIHVJZDogdUlkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSh1SWQsIHNldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB7fTtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy51SWQgPSB1SWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KHNldHRpbmdzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAodUlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KHVJZCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIHVwZGF0ZSB1c2VyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVJZFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKHVJZCwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZSh1SWQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhVXNlclN1YnN0aXR1ZGUnLCBbJ1NlYVJlcXVlc3QnLFxuICAgIGZ1bmN0aW9uIHNlYVVzZXJTdWJzdGl0dWRlKFNlYVJlcXVlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ3VzZXIve3VJZH0vc3Vic3RpdHVkZS97c3Vic3RpdHVkZUlkfScpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXQodUlkLCBzdWJzdElkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KHtcbiAgICAgICAgICAgICAgICAgICAgdUlkOiB1SWQsXG4gICAgICAgICAgICAgICAgICAgIHN1YnN0aXR1ZGVJZDogc3Vic3RJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiByZW1vdmUodUlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcbiAgICAgICAgICAgICAgICAgICAgdUlkOiB1SWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBzZXQgYSBzdWJzdGl0dWRlXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGdJZFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1SWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh1SWQsIHN1YnN0SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNldCh1SWQsIHN1YnN0SWQpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiByZW1vdmUgc3Vic3RpdHVkZVxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1SWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICByZW1vdmU6IGZ1bmN0aW9uICh1SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlbW92ZSh1SWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgfV0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFVc2VyJywgWydTZWFSZXF1ZXN0JywgJ3NlYVVzZXJHcm91cCcsICdzZWFVc2VyU2V0dGluZycsICdzZWFVc2VyU3Vic3RpdHVkZScsXG4gICAgZnVuY3Rpb24gc2VhVXNlcihTZWFSZXF1ZXN0LCBzZWFVc2VyR3JvdXAsIHNlYVVzZXJTZXR0aW5nLCBzZWFVc2VyU3Vic3RpdHVkZSkge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgndXNlci97dUlkfScpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGUocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXQodUlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgdUlkOiB1SWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKHVzZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQodXNlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3kodUlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcbiAgICAgICAgICAgICAgICAgICAgdUlkOiB1SWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gc2VhcmNoKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldChwYXJhbXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIGNyZWF0ZSB1c2VyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2N1c3RvbWVySWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbcHJlbmFtZV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtzdXJuYW1lXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2VtYWlsXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW3JvbGVdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbcGhvbmVdXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoZ0lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXQoZ0lkKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogdXBkYXRlIHVzZXJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gdXNlclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2N1c3RvbWVySWRdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbcHJlbmFtZV1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtzdXJuYW1lXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2VtYWlsXVxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW3JvbGVdXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbcGhvbmVdXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlKHVzZXIpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAodUlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXN0cm95KHVJZCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIHNlYXJjaCB1c2Vyc1xuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAgIHtPYmplY3R9ICAgcGFyYW1zXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyAge1N0cmluZ30gICBbcXVlcnldXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyAge1N0cmluZ30gICBbY3VzdG9tZXJJZF1cbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7Qm9vbGVhbn0gIFtpbmNsdWRlTG9jYXRpb25dXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgc2VhcmNoOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWFyY2gocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgc2V0dGluZzogc2VhVXNlclNldHRpbmcsXG4gICAgICAgICAgICAgICAgZ3JvdXA6IHNlYVVzZXJHcm91cCxcbiAgICAgICAgICAgICAgICBzdWJzdGl0dWRlOiBzZWFVc2VyU3Vic3RpdHVkZVxuICAgICAgICAgICAgfTtcbiAgICB9XSk7XG59KSgpOyJdfQ==
