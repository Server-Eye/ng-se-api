/**
 * ng-se-api
 * @version 0.2.3
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

    angular.module('ngSeApi').factory('seaCustomer', ['SeaRequest', 'seaCustomerSetting', 'seaCustomerDispatchTime', 'seaCustomerTag',
    function seaCustomer(SeaRequest, seaCustomerSetting, seaCustomerDispatchTime, seaCustomerTag) {
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
                dispatchTime: seaCustomerDispatchTime,
                tag: seaCustomerTag
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

    angular.module('ngSeApi').factory('seaCustomerTag', ['SeaRequest',
    function seaCustomerTag(SeaRequest) {
            var request = new SeaRequest('customer/tag/{tId}');

            function create(params) {
                return request.post(params);
            }

            function list() {
                return request.get();
            }

            function update(tag) {
                return request.put(disptagatchTime);
            }

            function destroy(tId) {
                return request.del({
                    tId: tId
                });
            }

            return {
                /**
                 * create a tag
                 * @param {Object} params
                 * @config {String} [name]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function () {
                    return list();
                },

                /**
                 * update tag
                 * @param {Object} params
                 * @config {String} [tId]
                 * @config {String} [name]
                 */
                update: function (tag) {
                    return update(tag);
                },

                destroy: function (tId) {
                    return destroy(tId);
                }
            };
    }]);
})();
},{}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
(function () {
    "use strict";
    
    angular.module('ngSeApi', []);

    angular.module('ngSeApi').config(['seaConfigProvider', function (seaApiConfigProvider) {
        
    }]);
})();

},{}],28:[function(require,module,exports){
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
},{}],29:[function(require,module,exports){
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
},{}],30:[function(require,module,exports){
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
},{}],31:[function(require,module,exports){
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
},{}],32:[function(require,module,exports){
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
},{}]},{},[27,9,28,1,2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,19,18,20,24,25,26,21,22,23,32,30,29,31])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIi4uL2FnZW50L2FnZW50LmpzIiwiLi4vYWdlbnQvbWlzYy5qcyIsIi4uL2FnZW50L25vdGUuanMiLCIuLi9hZ2VudC9ub3RpZmljYXRpb24uanMiLCIuLi9hZ2VudC9zZXR0aW5nLmpzIiwiLi4vYWdlbnQvc3RhdGUuanMiLCIuLi9hZ2VudC90eXBlLmpzIiwiLi4vYXV0aC9hdXRoLmpzIiwiLi4vY29uZmlnLmpzIiwiLi4vY29udGFpbmVyL2NvbnRhaW5lci5qcyIsIi4uL2NvbnRhaW5lci9taXNjLmpzIiwiLi4vY29udGFpbmVyL25vdGUuanMiLCIuLi9jb250YWluZXIvbm90aWZpY2F0aW9uLmpzIiwiLi4vY29udGFpbmVyL3Byb3Bvc2FsLmpzIiwiLi4vY29udGFpbmVyL3N0YXRlLmpzIiwiLi4vY29udGFpbmVyL3RlbXBsYXRlLmpzIiwiLi4vY3VzdG9tZXIvY3VzdG9tZXIuanMiLCIuLi9jdXN0b21lci9kaXNwYXRjaFRpbWUuanMiLCIuLi9jdXN0b21lci9zZXR0aW5nLmpzIiwiLi4vY3VzdG9tZXIvdGFnLmpzIiwiLi4vZ3JvdXAvZ3JvdXAuanMiLCIuLi9ncm91cC9zZXR0aW5nLmpzIiwiLi4vZ3JvdXAvdXNlci5qcyIsIi4uL21lL21lLmpzIiwiLi4vbWUvbW9iaWxlcHVzaC5qcyIsIi4uL21lL25vdGlmaWNhdGlvbi5qcyIsIi4uL21vZHVsZS5qcyIsIi4uL3JlcXVlc3QuanMiLCIuLi91c2VyL2dyb3VwLmpzIiwiLi4vdXNlci9zZXR0aW5nLmpzIiwiLi4vdXNlci9zdWJzdGl0dWRlLmpzIiwiLi4vdXNlci91c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFBZ2VudCcsIFsnU2VhUmVxdWVzdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzZWFBZ2VudE5vdGUnLCAnc2VhQWdlbnROb3RpZmljYXRpb24nLCAnc2VhQWdlbnRNaXNjJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NlYUFnZW50U2V0dGluZycsICdzZWFBZ2VudFN0YXRlJywgJ3NlYUFnZW50VHlwZScsXHJcbiAgICBmdW5jdGlvbiBzZWFBZ2VudChTZWFSZXF1ZXN0LCBzZWFBZ2VudE5vdGUsIHNlYUFnZW50Tm90aWZpY2F0aW9uLCBzZWFBZ2VudE1pc2MsIHNlYUFnZW50U2V0dGluZywgc2VhQWdlbnRTdGF0ZSwgc2VhQWdlbnRUeXBlKSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2FnZW50L3thSWR9Jyk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGUocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldChhSWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XHJcbiAgICAgICAgICAgICAgICAgICAgYUlkOiBhSWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGUoYWdlbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dChhZ2VudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koYUlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIGFJZDogYUlkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogY3JlYXRlIGFnZW50XHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtwYXJlbnRJZF1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3R5cGVdXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUocGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjb3B5OiBzZWFBZ2VudE1pc2MuY29weSxcclxuXHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChhSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0KGFJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogdXBkYXRlIGFnZW50XHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gYWdlbnRcclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2FJZF1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW25hbWVdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtpbnRlcnZhbF1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAoYWdlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlKGFnZW50KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKGFJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXN0cm95KGFJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG5vdGU6IHNlYUFnZW50Tm90ZSxcclxuICAgICAgICAgICAgICAgIGFjdGlvbmxvZzogc2VhQWdlbnRNaXNjLmFjdGlvbmxvZyxcclxuICAgICAgICAgICAgICAgIGNoYXJ0OiBzZWFBZ2VudE1pc2MuY2hhcnQsXHJcbiAgICAgICAgICAgICAgICBub3RpZmljYXRpb246IHNlYUFnZW50Tm90aWZpY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgc2V0dGluZzogc2VhQWdlbnRTZXR0aW5nLFxyXG4gICAgICAgICAgICAgICAgc3RhdGU6IHNlYUFnZW50U3RhdGUsXHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogc2VhQWdlbnRNaXNjLmNhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgdHlwZTogc2VhQWdlbnRUeXBlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQWdlbnRNaXNjJywgWydTZWFSZXF1ZXN0JyxcclxuICAgIGZ1bmN0aW9uIHNlYUFnZW50TWlzYyhTZWFSZXF1ZXN0KSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2FnZW50L3thSWR9L3thY3Rpb259Jyk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0QWN0aW9ubG9nKGFJZCwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMuYUlkID0gYUlkO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmFjdGlvbiA9ICdhY3Rpb25sb2cnO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldENoYXJ0KGFJZCwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMuYUlkID0gYUlkO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmFjdGlvbiA9ICdjaGFydCc7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQocGFyYW1zKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY29weShhSWQsIHBhcmVudElkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0ge307XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMuYUlkID0gYUlkO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLnBhcmVudElkID0gcGFyZW50SWQ7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMuYWN0aW9uID0gJ2NvcHknO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0Q2F0ZWdvcmllcygpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7fSwgJ2FnZW50L2NhdGVnb3J5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBhY3Rpb25sb2c6IHtcclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiBsaXN0IGFjdGlvbiBsb2cgZW50cmllc1xyXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAgIHtTdHJpbmd9IGFJZCAgICBhZ2VudCBpZFxyXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSAgIHtPYmplY3R9IHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtOdW1iZXJ9IHN0YXJ0XHJcbiAgICAgICAgICAgICAgICAgICAgICogQGNvbmZpZyAge051bWJlcn0gbGltaXRcclxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBwcm9taXNlXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGFJZCwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0QWN0aW9ubG9nKGFJZCwgcGFyYW1zKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgY2hhcnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiBnZXQgY2hhcnQgY29uZmlnIGFuZCB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSBhSWQgICAgYWdlbnQgaWRcclxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7T2JqZWN0fSBwYXJhbXNcclxuICAgICAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7TnVtYmVyfSBzdGFydFxyXG4gICAgICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtOdW1iZXJ9IGxpbWl0XHJcbiAgICAgICAgICAgICAgICAgICAgICogQGNvbmZpZyAge051bWJlcn0gdmFsdWVUeXBlXHJcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybnMge09iamVjdH0gcHJvbWlzZVxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKGFJZCwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRDaGFydChhSWQsIHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdDogbGlzdENhdGVnb3JpZXNcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIGNvcHkgYWdlbnQgdG8gYSBwYXJlbnRcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAgIHtTdHJpbmd9IGFJZFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICAge1N0cmluZ30gICBwYXJlbnRJZFxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge09iamVjdH0gcHJvbWlzZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjb3B5OiBmdW5jdGlvbiAoYUlkLCBwYXJlbnRJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb3B5KGFJZCwgcGFyZW50SWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUFnZW50Tm90ZScsIFsnU2VhUmVxdWVzdCcsXHJcbiAgICBmdW5jdGlvbiBzZWFBZ2VudE5vdGUoU2VhUmVxdWVzdCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdhZ2VudC97YUlkfS9ub3RlL3tuSWR9Jyk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBmb3JtYXROb3RlKG5vdGUpIHtcclxuICAgICAgICAgICAgICAgIG5vdGUucG9zdGVkT24gPSBuZXcgRGF0ZShub3RlLnBvc3RlZE9uKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBub3RlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGUocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcykudGhlbihmb3JtYXROb3RlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdChhSWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XHJcbiAgICAgICAgICAgICAgICAgICAgYUlkOiBhSWRcclxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKG5vdGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG5vdGVzLCBmb3JtYXROb3RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vdGVzO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koYUlkLCBuSWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmRlbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgYUlkOiBhSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgbklkOiBuSWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBjcmVhdGUgYWdlbnQgbm90ZVxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbYUlkXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbWVzc2FnZV1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZShwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoYUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoYUlkKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKGFJZCwgbklkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3koYUlkLCBuSWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUFnZW50Tm90aWZpY2F0aW9uJywgWydTZWFSZXF1ZXN0JyxcclxuICAgIGZ1bmN0aW9uIHNlYUFnZW50Tml0aWZpY2F0aW9uKFNlYVJlcXVlc3QpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnYWdlbnQve2FJZH0vbm90aWZpY2F0aW9uL3tuSWR9Jyk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGUocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZShub3RpZmljYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dChub3RpZmljYXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0KGFJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcclxuICAgICAgICAgICAgICAgICAgICBhSWQ6IGFJZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koYUlkLCBuSWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmRlbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgYUlkOiBhSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgbklkOiBuSWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBjcmVhdGUgbm90aWZpY2F0aW9uXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFthSWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFt1c2VySWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbbWFpbF1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFtwaG9uZV1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFt0aWNrZXRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtkZWZlcklkXVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlKHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogdXBkYXRlIG5vdGlmaWNhdGlvblxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbklkXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbYUlkXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbdXNlcklkXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW21haWxdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbcGhvbmVdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbdGlja2V0XVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbZGVmZXJJZF1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShub3RpZmljYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoYUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoYUlkKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKGFJZCwgbklkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3koYUlkLCBuSWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUFnZW50U2V0dGluZycsIFsnU2VhUmVxdWVzdCcsXHJcbiAgICBmdW5jdGlvbiBzZWFBZ2VudFNldHRpbmcoU2VhUmVxdWVzdCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdhZ2VudC97YUlkfS9zZXR0aW5nL3trZXl9Jyk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGUoc2V0dGluZykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KHBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QoYUlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGFJZDogYUlkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogY3JlYXRlIGFnZW50IG5vdGVcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2FJZF1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2tleV1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3ZhbHVlXVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChzZXR0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShzZXR0aW5nKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGFJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KGFJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQWdlbnRTdGF0ZScsIFsnU2VhUmVxdWVzdCcsXHJcbiAgICBmdW5jdGlvbiBzZWFBZ2VudFN0YXRlKFNlYVJlcXVlc3QpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnYWdlbnQve2FJZH0vc3RhdGUnKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGZvcm1hdFN0YXRlKHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5kYXRlID0gbmV3IERhdGUoc3RhdGUuZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5sYXN0RGF0ZSA9IG5ldyBEYXRlKHN0YXRlLmxhc3REYXRlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gaGludChzZXR0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QoYUlkLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5hSWQgPSBhSWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwYXJhbXMuYUlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zLCAnYWdlbnQvc3RhdGUnKS50aGVuKGZ1bmN0aW9uIChzdGF0ZXNCeUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChPYmplY3Qua2V5cyhzdGF0ZXNCeUlkKSwgZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHN0YXRlc0J5SWRba2V5XSwgZm9ybWF0U3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZXNCeUlkO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcykudGhlbihmdW5jdGlvbiAoc3RhdGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHN0YXRlcywgZm9ybWF0U3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGVzO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIGNyZWF0ZSBhZ2VudCBzdGF0ZSBoaW50XHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFthSWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtzSWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFthdXRob3JdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtoaW50VHlwZV1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW21lc3NhZ2VdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFthc3NpZ25lZFVzZXJdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtBcnJheX0gW21lbnRpb25lZFVzZXJzXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW3ByaXZhdGVdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFt1bnRpbF1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaGludDogZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoaW50KHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogbGlzdCBhZ2VudCBzdGF0ZXNcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAgIHtTdHJpbmd9ICAgYUlkXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW2xpbWl0XVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbc3RhcnRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtlbmRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbaW5jbHVkZUhpbnRzXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW2luY2x1ZGVSYXdEYXRhXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbZm9ybWF0XVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoYUlkLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdChhSWQsIHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQWdlbnRUeXBlJywgWydTZWFSZXF1ZXN0JyxcclxuICAgIGZ1bmN0aW9uIHNlYUFnZW50VHlwZShTZWFSZXF1ZXN0KSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2FnZW50L3R5cGUnKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RTZXR0aW5ncyhha0lkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGFrSWQ6IGFrSWRcclxuICAgICAgICAgICAgICAgIH0sICdhZ2VudC90eXBlL3tha0lkfS9zZXR0aW5nJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNldHRpbmc6IHtcclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiBsaXN0IHNldHRpbmdzIG9mIGFuIGFnZW50IHR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbYWtJZF1cclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoYWtJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdFNldHRpbmdzKGFrSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbGlzdDogbGlzdFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUF1dGgnLCBbJ1NlYVJlcXVlc3QnLFxyXG4gICAgZnVuY3Rpb24gc2VhQXV0aChTZWFSZXF1ZXN0KSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2F1dGgve2FjdGlvbn0nKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUFwaUtleShwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5hY3Rpb24gPSAna2V5JztcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvZ2luKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmFjdGlvbiA9ICdsb2dpbic7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBsb2dvdXQocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMuYWN0aW9uID0gJ2xvZ291dCc7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIGNyZWF0ZSBhcGlLZXlcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2VtYWlsXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbcGFzc3dvcmRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFt0eXBlXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbdmFsaWRVbnRpbF1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW21heFVzZXNdXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNyZWF0ZUFwaUtleTogZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVBcGlLZXkocGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBsb2dpblxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbYXBpS2V5XVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbZW1haWxdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtwYXNzd29yZF1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFtjcmVhdGVBcGlLZXldXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFthcGlLZXlOYW1lXVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBsb2dpbjogZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsb2dpbihwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBsb2dvdXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9nb3V0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykucHJvdmlkZXIoJ3NlYUNvbmZpZycsIFsnJGh0dHBQcm92aWRlcicsIGZ1bmN0aW9uIFNlYUNvbmZpZ1Byb3ZpZGVyKCRodHRwUHJvdmlkZXIpIHtcclxuICAgICAgICB2YXIgY29uZmlnID0ge1xyXG4gICAgICAgICAgICBiYXNlVXJsOiAnaHR0cHM6Ly9hcGkuc2VydmVyLWV5ZS5kZScsXHJcbiAgICAgICAgICAgIGFwaVZlcnNpb246IDIsXHJcbiAgICAgICAgICAgIGFwaUtleTogbnVsbCxcclxuICAgICAgICAgICAgZ2V0VXJsOiBmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFt0aGlzLmJhc2VVcmwsIHRoaXMuYXBpVmVyc2lvbiwgcGF0aF0uam9pbignLycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAncmVxdWVzdCc6IGZ1bmN0aW9uIChyZXFDb25maWcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29uZmlnLmFwaUtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXFDb25maWcuaGVhZGVyc1sneC1hcGkta2V5J10gPSBjb25maWcuYXBpS2V5O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcUNvbmZpZztcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgJ3Jlc3BvbnNlJzogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNldEJhc2VVcmwgPSBmdW5jdGlvbiAoYmFzZVVybCkge1xyXG4gICAgICAgICAgICBjb25maWcuYmFzZVVybCA9IGJhc2VVcmw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldEFwaVZlcnNpb24gPSBmdW5jdGlvbiAoYXBpVmVyc2lvbikge1xyXG4gICAgICAgICAgICBjb25maWcuYXBpVmVyc2lvbiA9IGFwaVZlcnNpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldEFwaUtleSA9IGZ1bmN0aW9uIChhcGlLZXkpIHtcclxuICAgICAgICAgICAgY29uZmlnLmFwaUtleSA9IGFwaUtleTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuJGdldCA9IGZ1bmN0aW9uICgkaHR0cCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgZ2V0QmFzZVVybDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWcuYmFzZVVybDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBnZXRBcGlWZXJzaW9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy5hcGlWZXJzaW9uO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGdldEFwaUtleTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWcuYXBpS2V5O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldEFwaUtleTogZnVuY3Rpb24gKGFwaUtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5hcGlLZXkgPSBhcGlLZXk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZ2V0VXJsOiBmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbY29uZmlnLmJhc2VVcmwsIGNvbmZpZy5hcGlWZXJzaW9uLCBwYXRoXS5qb2luKCcvJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUNvbnRhaW5lcicsIFsnU2VhUmVxdWVzdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzZWFDb250YWluZXJNaXNjJywgJ3NlYUNvbnRhaW5lck5vdGUnLCAnc2VhQ29udGFpbmVyTm90aWZpY2F0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NlYUNvbnRhaW5lclByb3Bvc2FsJywgJ3NlYUNvbnRhaW5lclN0YXRlJywgJ3NlYUNvbnRhaW5lclRlbXBsYXRlJyxcclxuICAgIGZ1bmN0aW9uIHNlYUNvbnRhaW5lcihTZWFSZXF1ZXN0LCBzZWFDb250YWluZXJNaXNjLCBzZWFDb250YWluZXJOb3RlLCBzZWFDb250YWluZXJOb3RpZmljYXRpb24sIHNlYUNvbnRhaW5lclByb3Bvc2FsLCBzZWFDb250YWluZXJTdGF0ZSwgc2VhQ29udGFpbmVyVGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnY29udGFpbmVyL3tjSWR9Jyk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXQoY0lkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNJZDogY0lkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koY0lkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNJZDogY0lkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKGNJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXQoY0lkKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiB1cGRhdGUgY29udGFpbmVyXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGFpbmVyXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjSWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtuYW1lXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW2FsZXJ0T2ZmbGluZV1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFthbGVydFNodXRkb3duXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbbWF4SGVhcnRiZWF0VGltZW91dF1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAoY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShjb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoY0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3koY0lkKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgYWN0aW9ubG9nOiBzZWFDb250YWluZXJNaXNjLmFjdGlvbmxvZyxcclxuICAgICAgICAgICAgICAgIGludmVudG9yeTogc2VhQ29udGFpbmVyTWlzYy5pbnZlbnRvcnksXHJcbiAgICAgICAgICAgICAgICBub3RlOiBzZWFDb250YWluZXJOb3RlLFxyXG4gICAgICAgICAgICAgICAgbm90aWZpY2F0aW9uOiBzZWFDb250YWluZXJOb3RpZmljYXRpb24sXHJcbiAgICAgICAgICAgICAgICBwY3Zpc2l0OiBzZWFDb250YWluZXJNaXNjLnBjdmlzaXQsXHJcbiAgICAgICAgICAgICAgICBwcm9wb3NhbDogc2VhQ29udGFpbmVyUHJvcG9zYWwsXHJcbiAgICAgICAgICAgICAgICBzdGF0ZTogc2VhQ29udGFpbmVyU3RhdGUsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogc2VhQ29udGFpbmVyVGVtcGxhdGVcclxuICAgICAgICAgICAgfTtcclxuICAgIH1dKTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFDb250YWluZXJNaXNjJywgWydTZWFSZXF1ZXN0JyxcclxuICAgIGZ1bmN0aW9uIHNlYUNvbnRhaW5lck1pc2MoU2VhUmVxdWVzdCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdjb250YWluZXIve2NJZH0ve2FjdGlvbn0nKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RBY3Rpb25sb2coY0lkLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5jSWQgPSBjSWQ7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMuYWN0aW9uID0gJ2FjdGlvbmxvZyc7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQocGFyYW1zKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0SW52ZW50b3J5KGNJZCwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMuY0lkID0gY0lkO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmFjdGlvbiA9ICdpbnZlbnRvcnknO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvbm5lY3RQY3Zpc2l0KGNJZCwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMuY0lkID0gY0lkO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmFjdGlvbiA9ICdwY3Zpc2l0JztcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldChwYXJhbXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9ubG9nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogbGlzdCBhY3Rpb24gbG9nIGVudHJpZXNcclxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSBjSWRcclxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7T2JqZWN0fSBwYXJhbXNcclxuICAgICAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7TnVtYmVyfSBbc3RhcnRdXHJcbiAgICAgICAgICAgICAgICAgICAgICogQGNvbmZpZyAge051bWJlcn0gW2xpbWl0XVxyXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHByb21pc2VcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoY0lkLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RBY3Rpb25sb2coY0lkLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgaW52ZW50b3J5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogZ2V0IGludmVudG9yeSBvZiB0aGUgY29udGFpbmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtICAge1N0cmluZ30gICBjSWRcclxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgIHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2Zvcm1hdF1cclxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBwcm9taXNlXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoY0lkLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldEludmVudG9yeShjSWQsIHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHBjdmlzaXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiBpbnN0YWxsIGFuZCBjb25uZWN0IHRvIHBjdmlzaXRcclxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSBjSWRcclxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgIHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtTdHJpbmd9ICAgW3N1cHBvcnRlcklkXVxyXG4gICAgICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtTdHJpbmd9ICAgW3N1cHBvcnRlclBhc3N3b3JkXVxyXG4gICAgICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtTdHJpbmd9ICAgW3VzZXJdXHJcbiAgICAgICAgICAgICAgICAgICAgICogQGNvbmZpZyAge1N0cmluZ30gICBbcGFzc3dvcmRdXHJcbiAgICAgICAgICAgICAgICAgICAgICogQGNvbmZpZyAge1N0cmluZ30gICBbZG9tYWluXVxyXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHByb21pc2VcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBjb25uZWN0OiBmdW5jdGlvbiAoY0lkLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbm5lY3RQY3Zpc2l0KGNJZCwgcGFyYW1zKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQ29udGFpbmVyTm90ZScsIFsnU2VhUmVxdWVzdCcsXHJcbiAgICBmdW5jdGlvbiBzZWFDb250YWluZXJOb3RlKFNlYVJlcXVlc3QpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnY29udGFpbmVyL3tjSWR9L25vdGUve25JZH0nKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGZvcm1hdE5vdGUobm90ZSkge1xyXG4gICAgICAgICAgICAgICAgbm90ZS5wb3N0ZWRPbiA9IG5ldyBEYXRlKG5vdGUucG9zdGVkT24pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vdGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZShwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKS50aGVuKGZvcm1hdE5vdGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0KGNJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcclxuICAgICAgICAgICAgICAgICAgICBjSWQ6IGNJZFxyXG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAobm90ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobm90ZXMsIGZvcm1hdE5vdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm90ZXM7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZGVzdHJveShjSWQsIG5JZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcclxuICAgICAgICAgICAgICAgICAgICBhSWQ6IGNJZCxcclxuICAgICAgICAgICAgICAgICAgICBuSWQ6IG5JZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIGNyZWF0ZSBub3RlXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjSWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFttZXNzYWdlXVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlKHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChjSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdChjSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoY0lkLCBuSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveShjSWQsIG5JZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQ29udGFpbmVyTm90aWZpY2F0aW9uJywgWydTZWFSZXF1ZXN0JyxcclxuICAgIGZ1bmN0aW9uIHNlYUNvbnRhaW5lck5vdGlmaWNhdGlvbihTZWFSZXF1ZXN0KSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2NvbnRhaW5lci97Y0lkfS9ub3RpZmljYXRpb24ve25JZH0nKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZShwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKG5vdGlmaWNhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KG5vdGlmaWNhdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QoY0lkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNJZDogY0lkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZGVzdHJveShjSWQsIG5JZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcclxuICAgICAgICAgICAgICAgICAgICBjSWQ6IGNJZCxcclxuICAgICAgICAgICAgICAgICAgICBuSWQ6IG5JZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIGNyZWF0ZSBub3RpZmljYXRpb25cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2NJZF1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3VzZXJJZF1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFttYWlsXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW3Bob25lXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW3RpY2tldF1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2RlZmVySWRdXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUocGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiB1cGRhdGUgbm90aWZpY2F0aW9uXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtuSWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjSWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFt1c2VySWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbbWFpbF1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFtwaG9uZV1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFt0aWNrZXRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtkZWZlcklkXVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlKG5vdGlmaWNhdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChjSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdChjSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoY0lkLCBuSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveShjSWQsIG5JZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQ29udGFpbmVyUHJvcG9zYWwnLCBbJ1NlYVJlcXVlc3QnLFxyXG4gICAgZnVuY3Rpb24gc2VhQ29udGFpbmVyUHJvcG9zYWwoU2VhUmVxdWVzdCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdjb250YWluZXIve2NJZH0vcHJvcG9zYWwve3BJZH0nKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGFjY2VwdChjSWQsIHBJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KHtcclxuICAgICAgICAgICAgICAgICAgICBjSWQ6IGNJZCxcclxuICAgICAgICAgICAgICAgICAgICBwSWQ6IHBJZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QoY0lkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNJZDogY0lkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZGVueShjSWQsIHBJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcclxuICAgICAgICAgICAgICAgICAgICBjSWQ6IGNJZCxcclxuICAgICAgICAgICAgICAgICAgICBwSWQ6IHBJZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RTZXR0aW5ncyhjSWQsIHBJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHtcclxuICAgICAgICAgICAgICAgICAgICBjSWQ6IGNJZCxcclxuICAgICAgICAgICAgICAgICAgICBwSWQ6IHBJZFxyXG4gICAgICAgICAgICAgICAgfSwgJ2NvbnRhaW5lci97Y0lkfS9wcm9wb3NhbC97cElkfS9zZXR0aW5nJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBhY2NlcHQ6IGZ1bmN0aW9uIChjSWQsIHBJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2NlcHQoY0lkLCBwSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoY0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoY0lkKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgZGVueTogZnVuY3Rpb24gKGNJZCwgcElkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlbnkoY0lkLCBwSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChjSWQsIHBJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdFNldHRpbmdzKGNJZCwgcElkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQ29udGFpbmVyU3RhdGUnLCBbJ1NlYVJlcXVlc3QnLFxyXG4gICAgZnVuY3Rpb24gc2VhQ29udGFpbmVyU3RhdGUoU2VhUmVxdWVzdCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdjb250YWluZXIve2NJZH0vc3RhdGUnKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGZvcm1hdFN0YXRlKHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5kYXRlID0gbmV3IERhdGUoc3RhdGUuZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5sYXN0RGF0ZSA9IG5ldyBEYXRlKHN0YXRlLmxhc3REYXRlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gaGludChzZXR0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QoY0lkLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5jSWQgPSBjSWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShwYXJhbXMuY0lkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zLCAnY29udGFpbmVyL3N0YXRlJykudGhlbihmdW5jdGlvbiAoc3RhdGVzQnlJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goT2JqZWN0LmtleXMoc3RhdGVzQnlJZCksIGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChzdGF0ZXNCeUlkW2tleV0sIGZvcm1hdFN0YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQocGFyYW1zKS50aGVuKGZ1bmN0aW9uIChzdGF0ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goc3RhdGVzLCBmb3JtYXRTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZXM7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogY3JlYXRlIGNvbnRhaW5lciBzdGF0ZSBoaW50XHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjSWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtzSWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFthdXRob3JdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtoaW50VHlwZV1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW21lc3NhZ2VdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFthc3NpZ25lZFVzZXJdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtBcnJheX0gW21lbnRpb25lZFVzZXJzXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW3ByaXZhdGVdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFt1bnRpbF1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaGludDogZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoaW50KHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogbGlzdCBjb250YWluZXIgc3RhdGVzXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgIGNJZFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9XHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtsaW1pdF1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW3N0YXJ0XVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbZW5kXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7Qm9vbGVhbn0gW2luY2x1ZGVIaW50c11cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFtpbmNsdWRlUmF3RGF0YV1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2Zvcm1hdF1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGNJZCwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoY0lkLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUNvbnRhaW5lclRlbXBsYXRlJywgWydTZWFSZXF1ZXN0JyxcclxuICAgIGZ1bmN0aW9uIHNlYUNvbnRhaW5lclRlbXBsYXRlKFNlYVJlcXVlc3QpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnY29udGFpbmVyL3tjSWR9L3RlbXBsYXRlL3t0SWR9Jyk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGUoY0lkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHtcclxuICAgICAgICAgICAgICAgICAgICBjSWQ6IGNJZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGFzc2lnbihjSWQsIHRJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgY0lkOiBjSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdElkOiB0SWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBjcmVhdGUgdGVtcGxhdGUgZm9ybSBzeXN0ZW1cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjSWRcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAoY0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZShjSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIGFzc2lnbiBhIHRlbXBsYXRlIHRvIGEgc3lzdGVtXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY0lkXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdElkXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGFzc2lnbjogZnVuY3Rpb24gKGNJZCwgdElkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFzc2lnbihjSWQsIHRJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQ3VzdG9tZXInLCBbJ1NlYVJlcXVlc3QnLCAnc2VhQ3VzdG9tZXJTZXR0aW5nJywgJ3NlYUN1c3RvbWVyRGlzcGF0Y2hUaW1lJywgJ3NlYUN1c3RvbWVyVGFnJyxcclxuICAgIGZ1bmN0aW9uIHNlYUN1c3RvbWVyKFNlYVJlcXVlc3QsIHNlYUN1c3RvbWVyU2V0dGluZywgc2VhQ3VzdG9tZXJEaXNwYXRjaFRpbWUsIHNlYUN1c3RvbWVyVGFnKSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2N1c3RvbWVyL3tjSWR9Jyk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXQoY0lkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNJZDogY0lkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKGN1c3RvbWVyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQoY3VzdG9tZXIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoY0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldChjSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIHVwZGF0ZSBjdXN0b21lclxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGN1c3RvbWVyXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjSWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjb3VudHJ5XVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbY3VzdG9tZXJOdW1iZXJJbnRlcm5dXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtjdXN0b21lck51bWJlckV4dGVybl1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2NvbXBhbnlOYW1lXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbc3RyZWV0XVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbemlwQ29kZV1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2NpdHldXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtlbWFpbF1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3Bob25lXVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChjdXN0b21lcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGUoY3VzdG9tZXIpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nOiBzZWFDdXN0b21lclNldHRpbmcsXHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaFRpbWU6IHNlYUN1c3RvbWVyRGlzcGF0Y2hUaW1lLFxyXG4gICAgICAgICAgICAgICAgdGFnOiBzZWFDdXN0b21lclRhZ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYUN1c3RvbWVyRGlzcGF0Y2hUaW1lJywgWydTZWFSZXF1ZXN0JyxcclxuICAgIGZ1bmN0aW9uIHNlYUN1c3RvbWVyRGlzcGF0Y2hUaW1lKFNlYVJlcXVlc3QpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnY3VzdG9tZXIvZGlzcGF0Y2hUaW1lL3tkdElkfScpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0KCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZShkaXNwYXRjaFRpbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dChkaXNwYXRjaFRpbWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBkZXN0cm95KGR0SWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmRlbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgZHRJZDogZHRJZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIGNyZWF0ZSBkaXNwYXRjaFRpbWVcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW25hbWVdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtOdW1iZXJ9IFtkZWZlcl1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZShwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiB1cGRhdGUgZGlzcGF0Y2hUaW1lXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtkdElkXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbmFtZV1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge051bWJlcn0gW2RlZmVyXVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChkaXNwYXRjaFRpbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlKGRpc3BhdGNoVGltZSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIChkdElkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3koZHRJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQ3VzdG9tZXJTZXR0aW5nJywgWydTZWFSZXF1ZXN0JyxcclxuICAgIGZ1bmN0aW9uIHNlYUN1c3RvbWVyU2V0dGluZyhTZWFSZXF1ZXN0KSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2N1c3RvbWVyL3tjSWR9L3NldHRpbmcnKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QoY0lkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNJZDogY0lkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKGNJZCwgc2V0dGluZ3MpIHtcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwge307XHJcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5jSWQgPSBjSWQ7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQoc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKGNJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KGNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogdXBkYXRlIGN1c3RvbWVyXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY0lkXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAoY0lkLCBzZXR0aW5ncykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGUoY0lkLCBzZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhQ3VzdG9tZXJUYWcnLCBbJ1NlYVJlcXVlc3QnLFxyXG4gICAgZnVuY3Rpb24gc2VhQ3VzdG9tZXJUYWcoU2VhUmVxdWVzdCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdjdXN0b21lci90YWcve3RJZH0nKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZShwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnBvc3QocGFyYW1zKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdCgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGUodGFnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQoZGlzcHRhZ2F0Y2hUaW1lKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZGVzdHJveSh0SWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmRlbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdElkOiB0SWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBjcmVhdGUgYSB0YWdcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW25hbWVdXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGUocGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogdXBkYXRlIHRhZ1xyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbdElkXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbmFtZV1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAodGFnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZSh0YWcpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAodElkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3kodElkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgIH1dKTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFHcm91cCcsIFsnU2VhUmVxdWVzdCcsICdzZWFHcm91cFNldHRpbmcnLCAnc2VhR3JvdXBVc2VyJyxcclxuICAgIGZ1bmN0aW9uIHNlYUdyb3VwKFNlYVJlcXVlc3QsIHNlYUdyb3VwU2V0dGluZywgc2VhR3JvdXBVc2VyKSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ2dyb3VwL3tnSWR9Jyk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGUocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wb3N0KHBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldChnSWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XHJcbiAgICAgICAgICAgICAgICAgICAgZ0lkOiBnSWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGUoZ3JvdXApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dChncm91cCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koZ0lkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIGdJZDogZ0lkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogY3JlYXRlIGdyb3VwXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtjdXN0b21lcklkXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbbmFtZV1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZShwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChnSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0KGdJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogdXBkYXRlIGdyb3VwXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZ3JvdXBcclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2dJZF1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW25hbWVdXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKGdyb3VwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShncm91cCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIChnSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveShnSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nOiBzZWFHcm91cFNldHRpbmcsXHJcbiAgICAgICAgICAgICAgICB1c2VyOiBzZWFHcm91cFVzZXJcclxuICAgICAgICAgICAgfTtcclxuICAgIH1dKTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFHcm91cFNldHRpbmcnLCBbJ1NlYVJlcXVlc3QnLFxyXG4gICAgZnVuY3Rpb24gc2VhR3JvdXBTZXR0aW5nKFNlYVJlcXVlc3QpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnZ3JvdXAve2dJZH0vc2V0dGluZycpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdChnSWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XHJcbiAgICAgICAgICAgICAgICAgICAgZ0lkOiBnSWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGUoZ0lkLCBzZXR0aW5ncykge1xyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzLmdJZCA9IGdJZDtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dChzZXR0aW5ncyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoZ0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoZ0lkKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiB1cGRhdGUgZ3JvdXBcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBnSWRcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChnSWQsIHNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZShnSWQsIHNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgIH1dKTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFHcm91cFVzZXInLCBbJ1NlYVJlcXVlc3QnLFxyXG4gICAgZnVuY3Rpb24gc2VhR3JvdXBVc2VyKFNlYVJlcXVlc3QpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnZ3JvdXAve2dJZH0vdXNlci97dUlkfScpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gbGlzdChnSWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XHJcbiAgICAgICAgICAgICAgICAgICAgZ0lkOiBnSWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBhZGRVc2VyKGdJZCwgdUlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVJZDogdUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIGdJZDogZ0lkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gcmVtb3ZlVXNlcihnSWQsIHVJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcclxuICAgICAgICAgICAgICAgICAgICB1SWQ6IHVJZCxcclxuICAgICAgICAgICAgICAgICAgICBnSWQ6IGdJZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBsaXN0OiBmdW5jdGlvbiAoZ0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QoZ0lkKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBhZGQgdXNlciB0byBncm91cFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGdJZFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVJZFxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBhZGQ6IGZ1bmN0aW9uIChnSWQsIHVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhZGRVc2VyKGdJZCwgdUlkKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiByZW1vdmUgdXNlciB0byBncm91cFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGdJZFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVJZFxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIChnSWQsIHVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZW1vdmVVc2VyKGdJZCwgdUlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgIH1dKTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFNZScsIFsnU2VhUmVxdWVzdCcsICdzZWFNZU1vYmlsZXB1c2gnLCAnc2VhTWVOb3RpZmljYXRpb24nLFxyXG4gICAgZnVuY3Rpb24gc2VhTWUoU2VhUmVxdWVzdCwgc2VhTWVNb2JpbGVwdXNoLCBzZWFNZU5vdGlmaWNhdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCdtZS97YWN0aW9ufScpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gX2Zvcm1hdE5vZGUobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuZGF0ZSAmJiB0eXBlb2YgKG5vZGUuZGF0ZSkgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5kYXRlID0gbmV3IERhdGUobm9kZS5kYXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5sYXN0RGF0ZSAmJiB0eXBlb2YgKG5vZGUubGFzdERhdGUpID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUubGFzdERhdGUgPSBuZXcgRGF0ZShub2RlLmxhc3REYXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gX2Zvcm1hdERhdGEoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGlkeCA9IGRhdGEuaW5kZXhPZignbG9hZGZpbmlzaCcpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlkeCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIF9mb3JtYXROb2RlKGRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBtZSgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjdXN0b21lcigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmdldCh7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAnY3VzdG9tZXInXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZmVlZChwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5hY3Rpb24gPSAnZmVlZCc7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGtleShuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ2tleScsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG5vZGVzKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmFjdGlvbiA9ICdub2Rlcyc7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcykudGhlbihfZm9ybWF0RGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBtZTogbWUsXHJcbiAgICAgICAgICAgICAgICBjdXN0b21lcjogY3VzdG9tZXIsXHJcbiAgICAgICAgICAgICAgICBmZWVkOiBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZlZWQocGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBrZXk6IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleShuYW1lKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBub2RlczogZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlcyhwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBtb2JpbGVwdXNoOiBzZWFNZU1vYmlsZXB1c2gsXHJcbiAgICAgICAgICAgICAgICBub3RpZmljYXRpb246IHNlYU1lTm90aWZpY2F0aW9uXHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhTWVNb2JpbGVwdXNoJywgWydTZWFSZXF1ZXN0JyxcclxuICAgIGZ1bmN0aW9uIHNlYU1lTW9iaWxlcHVzaChTZWFSZXF1ZXN0KSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ21lL21vYmlsZXB1c2gve2hhbmRsZX0nKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXQoaGFuZGxlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZTogaGFuZGxlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZGVzdHJveShoYW5kbGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmRlbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlOiBoYW5kbGVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgbGlzdDogbGlzdCxcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIGFkZCBtb2JpbGVwdXNoXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7T2JqZWN0fSBwYXJhbXNcclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcgIHtTdHJpbmd9IGhhbmRsZVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyAge1N0cmluZ30gdHlwZVxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge09iamVjdH0gcHJvbWlzZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlKHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKGhhbmRsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXQoaGFuZGxlKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKGhhbmRsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXN0cm95KGhhbmRsZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgfV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYU1lTm90aWZpY2F0aW9uJywgWydTZWFSZXF1ZXN0JyxcclxuICAgIGZ1bmN0aW9uIHNlYU1lTm90aWZpY2F0aW9uKFNlYVJlcXVlc3QpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgnbWUvbm90aWZpY2F0aW9uL3tuSWR9Jyk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBsaXN0KHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KHBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZShub3RpZmljYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dChub3RpZmljYXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBkZXN0cm95KG5JZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QuZGVsKHtcclxuICAgICAgICAgICAgICAgICAgICBuSWQ6IG5JZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIGxpc3QgYWxsIG5vdGlmaWNhdGlvbnNcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAgIHtPYmplY3R9IHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyAge0Jvb2xlYW59ICBpbmNsdWRlR3JvdXBzXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBwcm9taXNlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGxpc3Q6IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdChwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIHVwZGF0ZSBub3RpZmljYXRpb25cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW25JZF1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2NJZCB8fCBhSWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtCb29sZWFufSBbbWFpbF1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFtwaG9uZV1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge0Jvb2xlYW59IFt0aWNrZXRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtkZWZlcklkXVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0KG5vdGlmaWNhdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIChuSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveShuSWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIFxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknLCBbXSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5jb25maWcoWydzZWFDb25maWdQcm92aWRlcicsIGZ1bmN0aW9uIChzZWFBcGlDb25maWdQcm92aWRlcikge1xyXG4gICAgICAgIFxyXG4gICAgfV0pO1xyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdTZWFSZXF1ZXN0JywgWydzZWFDb25maWcnLCAnJHEnLCAnJGh0dHAnLFxyXG4gICAgZnVuY3Rpb24gU2VhUmVxdWVzdChzZWFDb25maWcsICRxLCAkaHR0cCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBTZWFSZXF1ZXN0KHVybFBhdGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXJsUGF0aCA9IHVybFBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBNZXJnZXMgdXJsIGFuZCBwYXJhbXMgdG8gYSB2YWxpZCBhcGkgdXJsIHBhdGguXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIDxwcmU+PGNvZGU+XHJcbiAgICAgICAgICAgICAqIHVybCA9ICcvYWdlbnQvOmFJZCdcclxuICAgICAgICAgICAgICogcGFyYW1zID0geyBhSWQ6ICd0ZXN0LWFnZW50LWlkJywgbmFtZTogJ3Rlc3QgYWdlbnQnIH1cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogdXJsID0gZm9ybWF0VXJsKHVybFBhdGgsIHBhcmFtcylcclxuICAgICAgICAgICAgICogdXJsID09ICcvYWdlbnQvdGVzdC1hZ2VudC1pZCdcclxuICAgICAgICAgICAgICogPC9wcmU+PC9jb2RlPlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSB1cmwgICAgdXJsIHRlbXBsYXRlXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSAgIHtPYmplY3R9IHBhcmFtcyByZXF1ZXN0IHBhcmFtZXRlcnNcclxuICAgICAgICAgICAgICogQHJldHVybnMge1N0cmluZ31cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIFNlYVJlcXVlc3QucHJvdG90eXBlLmZvcm1hdFVybCA9IGZ1bmN0aW9uIGZvcm1hdFVybCh1cmwsIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMocGFyYW1zKSxcclxuICAgICAgICAgICAgICAgICAgICBpID0ga2V5cy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGktLSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoJ1xcXFx7JyArIGtleXNbaV0gKyAnXFxcXH0nLCAnZ20nKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVnZXgudGVzdCh1cmwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IHVybC5yZXBsYWNlKHJlZ2V4LCBwYXJhbXNba2V5c1tpXV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgcGFyYW1zW2tleXNbaV1dO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXFwve1thLXowLTldKn0kL2ksICcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBTZWFSZXF1ZXN0LnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24gc2VuZChtZXRob2QsIHBhcmFtcywgdXJsUGF0aCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZ1bGxVcmwgPSBzZWFDb25maWcuZ2V0VXJsKHVybFBhdGggfHwgdGhpcy51cmxQYXRoKSxcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZCA9ICRxLmRlZmVyKCksXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZiA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBtZXRob2RcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IGFuZ3VsYXIuY29weShwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgY29uZi51cmwgPSB0aGlzLmZvcm1hdFVybChmdWxsVXJsLCBwYXJhbXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChtZXRob2QgPT09ICdQT1NUJyB8fCBtZXRob2QgPT09ICdQVVQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uZi5kYXRhID0gcGFyYW1zIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25mLnBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkaHR0cChjb25mKS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBwZXJmb3JtIEdFVCByZXF1ZXN0XHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgcGFyYW1zICBUaGUgcmVxdWVzdCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgdXJsUGF0aCBvbmx5IGFwcGVuZCBpZiB1cmwgaXMgZGlmZmVyZW50IHRvIGNsYXNzZXMgdXJsUGF0aFxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gcHJvbWlzZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgU2VhUmVxdWVzdC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0KHBhcmFtcywgdXJsUGF0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnR0VUJywgcGFyYW1zLCB1cmxQYXRoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIHBlcmZvcm0gUE9TVCByZXF1ZXN0XHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgcGFyYW1zICBUaGUgcmVxdWVzdCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgdXJsUGF0aCBvbmx5IGFwcGVuZCBpZiB1cmwgaXMgZGlmZmVyZW50IHRvIGNsYXNzZXMgdXJsUGF0aFxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gcHJvbWlzZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgU2VhUmVxdWVzdC5wcm90b3R5cGUucG9zdCA9IGZ1bmN0aW9uIGdldChwYXJhbXMsIHVybFBhdGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ1BPU1QnLCBwYXJhbXMsIHVybFBhdGgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogcGVyZm9ybSBQVVQgcmVxdWVzdFxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gIHBhcmFtcyAgVGhlIHJlcXVlc3QgcGFyYW1ldGVyc1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gIHVybFBhdGggb25seSBhcHBlbmQgaWYgdXJsIGlzIGRpZmZlcmVudCB0byBjbGFzc2VzIHVybFBhdGhcclxuICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59IHByb21pc2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIFNlYVJlcXVlc3QucHJvdG90eXBlLnB1dCA9IGZ1bmN0aW9uIGdldChwYXJhbXMsIHVybFBhdGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ1BVVCcsIHBhcmFtcywgdXJsUGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBwZXJmb3JtIERFTEVURSByZXF1ZXN0XHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgcGFyYW1zICBUaGUgcmVxdWVzdCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgdXJsUGF0aCBvbmx5IGFwcGVuZCBpZiB1cmwgaXMgZGlmZmVyZW50IHRvIGNsYXNzZXMgdXJsUGF0aFxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gcHJvbWlzZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgU2VhUmVxdWVzdC5wcm90b3R5cGUuZGVsID0gZnVuY3Rpb24gZ2V0KHBhcmFtcywgdXJsUGF0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnREVMRVRFJywgcGFyYW1zLCB1cmxQYXRoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFNlYVJlcXVlc3Q7XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhVXNlckdyb3VwJywgWydTZWFSZXF1ZXN0JyxcclxuICAgIGZ1bmN0aW9uIHNlYVVzZXJHcm91cChTZWFSZXF1ZXN0KSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ3VzZXIve3VJZH0vZ3JvdXAve2dJZH0nKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QodUlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVJZDogdUlkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gYWRkVXNlcih1SWQsIGdJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KHtcclxuICAgICAgICAgICAgICAgICAgICB1SWQ6IHVJZCxcclxuICAgICAgICAgICAgICAgICAgICBnSWQ6IGdJZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlbW92ZVVzZXIodUlkLCBnSWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmRlbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdUlkOiB1SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgZ0lkOiBnSWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKHVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KHVJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogYWRkIHVzZXIgdG8gZ3JvdXBcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBnSWRcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1SWRcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgYWRkOiBmdW5jdGlvbiAodUlkLCBnSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWRkVXNlcih1SWQsIGdJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogcmVtb3ZlIHVzZXIgdG8gZ3JvdXBcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBnSWRcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1SWRcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAodUlkLCBnSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVtb3ZlVXNlcih1SWQsIGdJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCduZ1NlQXBpJykuZmFjdG9yeSgnc2VhVXNlclNldHRpbmcnLCBbJ1NlYVJlcXVlc3QnLFxyXG4gICAgZnVuY3Rpb24gc2VhVXNlclNldHRpbmcoU2VhUmVxdWVzdCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBTZWFSZXF1ZXN0KCd1c2VyL3t1SWR9L3NldHRpbmcnKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3QodUlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVJZDogdUlkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKHVJZCwgc2V0dGluZ3MpIHtcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwge307XHJcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy51SWQgPSB1SWQ7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wdXQoc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgbGlzdDogZnVuY3Rpb24gKHVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0KHVJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogdXBkYXRlIHVzZXJcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1SWRcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uICh1SWQsIHNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZSh1SWQsIHNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgIH1dKTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ25nU2VBcGknKS5mYWN0b3J5KCdzZWFVc2VyU3Vic3RpdHVkZScsIFsnU2VhUmVxdWVzdCcsXHJcbiAgICBmdW5jdGlvbiBzZWFVc2VyU3Vic3RpdHVkZShTZWFSZXF1ZXN0KSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFNlYVJlcXVlc3QoJ3VzZXIve3VJZH0vc3Vic3RpdHVkZS97c3Vic3RpdHVkZUlkfScpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gc2V0KHVJZCwgc3Vic3RJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHV0KHtcclxuICAgICAgICAgICAgICAgICAgICB1SWQ6IHVJZCxcclxuICAgICAgICAgICAgICAgICAgICBzdWJzdGl0dWRlSWQ6IHN1YnN0SWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiByZW1vdmUodUlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5kZWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVJZDogdUlkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogc2V0IGEgc3Vic3RpdHVkZVxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGdJZFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVJZFxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh1SWQsIHN1YnN0SWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2V0KHVJZCwgc3Vic3RJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogcmVtb3ZlIHN1YnN0aXR1ZGVcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1SWRcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAodUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlbW92ZSh1SWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgfV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnbmdTZUFwaScpLmZhY3RvcnkoJ3NlYVVzZXInLCBbJ1NlYVJlcXVlc3QnLCAnc2VhVXNlckdyb3VwJywgJ3NlYVVzZXJTZXR0aW5nJywgJ3NlYVVzZXJTdWJzdGl0dWRlJyxcclxuICAgIGZ1bmN0aW9uIHNlYVVzZXIoU2VhUmVxdWVzdCwgc2VhVXNlckdyb3VwLCBzZWFVc2VyU2V0dGluZywgc2VhVXNlclN1YnN0aXR1ZGUpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU2VhUmVxdWVzdCgndXNlci97dUlkfScpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucG9zdChwYXJhbXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXQodUlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVJZDogdUlkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKHVzZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnB1dCh1c2VyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZGVzdHJveSh1SWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LmRlbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdUlkOiB1SWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBzZWFyY2gocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQocGFyYW1zKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogY3JlYXRlIHVzZXJcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2N1c3RvbWVySWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtwcmVuYW1lXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbc3VybmFtZV1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2VtYWlsXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbcm9sZV1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3Bob25lXVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlKHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKGdJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXQoZ0lkKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiB1cGRhdGUgdXNlclxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHVzZXJcclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2N1c3RvbWVySWRdXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnIHtTdHJpbmd9IFtwcmVuYW1lXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7U3RyaW5nfSBbc3VybmFtZV1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW2VtYWlsXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyB7TnVtYmVyfSBbcm9sZV1cclxuICAgICAgICAgICAgICAgICAqIEBjb25maWcge1N0cmluZ30gW3Bob25lXVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZSh1c2VyKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKHVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXN0cm95KHVJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogc2VhcmNoIHVzZXJzXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgIHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyAge1N0cmluZ30gICBbcXVlcnldXHJcbiAgICAgICAgICAgICAgICAgKiBAY29uZmlnICB7U3RyaW5nfSAgIFtjdXN0b21lcklkXVxyXG4gICAgICAgICAgICAgICAgICogQGNvbmZpZyAge0Jvb2xlYW59ICBbaW5jbHVkZUxvY2F0aW9uXVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBzZWFyY2g6IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VhcmNoKHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIHNldHRpbmc6IHNlYVVzZXJTZXR0aW5nLFxyXG4gICAgICAgICAgICAgICAgZ3JvdXA6IHNlYVVzZXJHcm91cCxcclxuICAgICAgICAgICAgICAgIHN1YnN0aXR1ZGU6IHNlYVVzZXJTdWJzdGl0dWRlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XSk7XHJcbn0pKCk7Il19
