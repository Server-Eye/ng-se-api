(function () {
    "use strict";
    
    angular.module('ngSeApi', []);
})();

(function () {
    "use strict";

    angular.module('ngSeApi').provider('seaConfig', ['$httpProvider',
        function SeaConfigProvider($httpProvider) {
            var config = {
                baseUrl: 'https://api.server-eye.de',
                patchUrl: 'https://patch.server-eye.de',
                pmUrl: 'https://pm.server-eye.de',
                microServiceUrl: 'https://api-ms.server-eye.de',
                socketUrl: 'https://api.server-eye.de',
                apiVersion: 2,
                microServiceApiVersion: 3,
                apiKey: null,
                getUrl: function (path) {
                    return [this.baseUrl, this.apiVersion, path].join('/');
                },
                addTraces: false
            };

            $httpProvider.interceptors.push(function () {
                return {
                    'request': function (reqConfig) {
                        if (reqConfig.url && reqConfig.url.includes(config.patchUrl)) { return reqConfig; }

                        reqConfig.headers['x-request-origin'] = "OCC";

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

            this.setPatchUrl = function (patchUrl) {
                config.patchUrl = patchUrl;
            }

            this.setPmUrl = function (pmUrl) {
                config.pmUrl = pmUrl;
            }

            this.setMicroServiceUrl = function (microServiceUrl) {
                config.microServiceUrl = microServiceUrl;
            }

            this.setSocketUrl = function (socketUrl) {
                config.socketUrl = socketUrl;
            }

            this.setApiVersion = function (apiVersion) {
                config.apiVersion = apiVersion;
            }

            this.setMicroServiceApiVersion = function (microServiceApiVersion) {
                config.microServiceApiVersion = microServiceApiVersion;
            }

            this.setApiKey = function (apiKey) {
                config.apiKey = apiKey;
            }

            this.setAddTraces = function (addTraces) {
                config.addTraces = addTraces;
            }

            this.$get = function ($http) {
                return {
                    getBaseUrl: function () {
                        return config.baseUrl;
                    },
                    getPatchUrl: function () {
                        return config.patchUrl;
                    },
                    getPmUrl: function () {
                        return config.pmUrl;
                    },
                    getMicroServiceUrl: function () {
                        return config.microServiceUrl;
                    },
                    getSocketUrl: function () {
                        return config.socketUrl;
                    },
                    getApiVersion: function () {
                        return config.apiVersion;
                    },
                    getMicroServiceApiVersion: function () {
                        return config.microServiceApiVersion;
                    },
                    getApiKey: function () {
                        return config.apiKey;
                    },
                    setApiKey: function (apiKey) {
                        config.apiKey = apiKey;
                    },
                    setAddTraces: function (addTraces) {
                        config.addTraces = addTraces;
                    },
                    getAddTraces: function () {
                        return config.addTraces;
                    },
                    getUrl: function (path) {
                        return [config.baseUrl, config.apiVersion, path].join('/');
                    }
                }
            };
        }]);

    angular.module('ngSeApi').config(['seaConfigProvider',
        function (seaApiConfigProvider) {

        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('SeaRequest', ['seaConfig', '$q', '$http', 'SeaTracer', 'SeaRequestHelperService',
        function SeaRequest(seaConfig, $q, $http, SeaTracer, SeaRequestHelperService) {
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
            SeaRequest.prototype.formatUrl = function formatUrl(params, url) {
                url = url || this.urlPath;

                if (url.indexOf('http') < 0) {
                    url = seaConfig.getUrl(url || this.urlPath)
                }

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

                url = url.replace(/\/{[a-z0-9]*}/ig, '');

                return url;
            }

            SeaRequest.prototype.send = function send(method, params, urlPath) {
                var deferred = $q.defer(),
                    conf = {
                        method: method
                    };

                params = params || {};
                params = angular.copy(params);

                conf.url = this.formatUrl(params, urlPath);

                if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
                    conf.data = params || {};
                    conf.headers = {
                        'Content-Type': 'application/json'
                    };
                } else {
                    conf.params = params || {};
                }

                SeaRequestHelperService.dumpRequest(conf);
                SeaTracer.start(conf);

                $http(conf).then(function (resp) {
                    var total = resp.headers('x-total-count');

                    if (total != null) {
                        resp.data.totalCount = total;
                    }

                    SeaTracer.stop(resp, conf);

                    deferred.resolve(resp.data);
                }, function (err) {
                    SeaRequestHelperService.dumpResponse(err);
                    SeaTracer.stop(err, conf);
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

    angular.module('ngSeApi').factory('SeaRequestHelperService', [
        function () {
            var dump = {
                request: undefined,
                response: undefined,
            };

            function dumpRequest(data) {
                dump.request = data;
            }

            function dumpResponse(data) {
                dump.response = data;
            }

            function getDump() {
                var dumpData = JSON.stringify(dump);
                dump.request = undefined;
                dump.response = undefined;

                return dumpData;
            }

            return {
                dumpRequest: dumpRequest,
                dumpResponse: dumpResponse,
                getDump: getDump,
            };
        }]);
})();
(function () {
    "use strict";

    var VALID_EVENTS = [
        'USER_UPDATE',
        'NODE_ADD',
        'NODE_UPDATE',
        'NODE_REMOVE',
        'REMOTE_RESULT',
        'user_location_change',
    ];

    angular.module('ngSeApi').factory('seaSocket', ['$rootScope', 'seaConfig',
    function ($rootScope, seaConfig) {
            var connected = false,
                reconnected = false,
                hasEverBeenConnected = false,
                sio;

            var settings = {};

            function fireEvent(name, argsObj) {
                argsObj = argsObj || {};
                console.log('fireEvent', 'se_socket_' + name, argsObj);
                $rootScope.$broadcast('se_socket_' + name, argsObj);
            }

            function connect(credentials, rooms) {
                if (typeof io == 'undefined') {
                    console.error('required socket.io lib not found');
                    return;
                }

                var connectUrl = seaConfig.getSocketUrl();
                
                // if(credentials) {
                //     connectUrl += Object.keys(credentials).reduce(function (p, key) {
                //         p += [ key, credentials[key] ].join('=');
                //         return p;
                //     }, '?');
                // }
                
                sio = io(connectUrl);

                settings.rooms = rooms;

                sio.on('error', onerror);
                sio.on('connect', onconnect);
                sio.on('connecting', function () {
                    console.log('connecting socket');
                });
                sio.on('disconnect', function () {
                    console.log('disconnected socket');
                    onerror('socket.disconnected');
                });
                sio.on('connect_error', function () {
                    console.log('connect socket failed');
                    onerror('socket.connect_failed');
                });
                sio.on('reconnect_error', function () {
                    console.log('reconnect socket failed');
                    onerror('socket.reconnect_failed');
                });
                sio.on('reconnecting', function () {
                    console.log('reconnecting socket');
                });

                sio.on('socket:joined', function (userId, roomId) {
                    console.log(userId, 'joined', roomId);
                });

                // server-eye events
                VALID_EVENTS.forEach(function (evtName) {
                    sio.on(evtName, function (data) {
                        ondata(evtName, data);
                    });
                });
            }

            function sendSettings() {
                sio.emit('settings', settings);
            }

            function onerror(err) {
                console.log('socket error:', err);
                connected = false;
                fireEvent('error', err);
            }

            function onconnect() {
                console.log('connected socket');
                connected = true;

                if (hasEverBeenConnected) {
                    reconnected = true;
                }

                hasEverBeenConnected = true;

                var evt = reconnected ? 'reconnected' : 'connected';

                console.log('firing socket', evt);

                sendSettings();

                fireEvent(evt);
            }

            function ondata(type, data) {
                if(data && data.targetNode) {
                    if(data.targetNode.date) {
                        data.targetNode.date = new Date(data.targetNode.date);
                    }
                    
                    if(data.targetNode.lastDate) {
                        data.targetNode.lastDate = new Date(data.targetNode.lastDate);
                    }
                }
                
                fireEvent(type.toLowerCase(), data);
            }

            return {
                connect: function (credentials, rooms) {
                    return connect(credentials, rooms);
                }
            }
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('SeaTracer', ['seaConfig', 'SeaUtils',
        function SeaTracer(seaConfig, SeaUtils) {
            var traces = {
                // 'id': {
                //     'internalTraceId': 'zipkinId',
                //     'req': {
                //         'ts': '2021-04-30T08:52:10.973Z',
                //         'method': 'GET',
                //         'url': 'https://',
                //         'query': 'asda=aaaa&sasdsa=1qsd',
                //         'body': {}
                //     },
                //     'res': {
                //         'ts': '2021-04-30T08:52:10.975Z',
                //         'data': {},
                //         'status': 200
                //     }
                // }
            };

            function start(reqConfig) {
                if (!seaConfig.getAddTraces() || !reqConfig) {
                    return;
                }

                if (!reqConfig.headers) {
                    reqConfig.headers = {};
                }

                var id = reqConfig.headers['x-request-id'] = SeaUtils.simpleUUID();
                traces[id] = {
                    internalTraceId: id.substr(0, 18).replaceAll('-', ''),
                    req: {
                        ts: new Date().toISOString(),
                        method: reqConfig.method,
                        url: reqConfig.url,
                        query: reqConfig.params,
                        body: reqConfig.data,
                    },
                };
            }

            function stop(response, reqConfig) {
                if (!seaConfig.getAddTraces() || !reqConfig) {
                    return;
                }
                var id = reqConfig.headers['x-request-id'];
                var trace = traces[id];

                if (!trace || !response) {
                    return;
                }

                angular.extend(trace, {
                    res: {
                        ts: new Date().toISOString(),
                        data: response.data,
                        status: response.status,
                        statusText: response.statusText,
                    },
                });
            }

            function flush() {
                var r = JSON.stringify(traces);
                traces = {};
                return r;
            }

            return {
                start,
                stop,
                flush
            }
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('SeaUtils', [
        function () {

            function simpleUUID() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }

            return {
                simpleUUID: simpleUUID,
            }
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgent', ['SeaRequest',
                                             'seaAgentNote', 'seaAgentNotification', 'seaAgentMisc',
                                             'seaAgentSetting', 'seaAgentState', 'seaAgentTag', 'seaAgentType',
    function seaAgent(SeaRequest, seaAgentNote, seaAgentNotification, seaAgentMisc, seaAgentSetting, seaAgentState, seaAgentTag, seaAgentType) {
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
                restart: seaAgentMisc.restart,
                tag: seaAgentTag,
                type: seaAgentType,
                events: seaAgentMisc.events,
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentMisc', ['SeaRequest',
        function seaAgentMisc(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/{action}');

            function formatActionlog(entry) {
                entry.changeDate = new Date(entry.changeDate);
                entry.changed = JSON.parse(entry.changed);
                try {
                    entry.userName = JSON.parse(entry.userName);
                } catch (e) {
                    entry.userName = {
                        email: entry.userName,
                        sur: entry.userName
                    };
                }

                if (entry.information) {
                    try {
                        entry.information = JSON.parse(entry.information);
                    } catch (e) {
                        entry.information = null;
                    }
                }

                return entry;
            }

            function formatMeasurement(m) {
                m.ts = new Date(m.name);
                return m;
            }

            function listActionlog(aId, params) {
                params = params || {};
                params.aId = aId;
                params.action = 'actionlog';
                return request.get(params);
            }

            function listEvents(aId, params) {
                params = params || {};
                params.aId = aId;
                params.action = 'events';
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

            function restart(aId) {
                var params = {};
                params.aId = aId;
                params.action = 'restart';
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
                        return listActionlog(aId, params).then(function (entries) {
                            angular.forEach(entries, formatActionlog);

                            return entries;
                        });
                    }
                },

                events: {
                    /**
                     * list action log entries
                     * @param   {String} aId    agent id
                     * @param   {Object} params
                     * @config  {Number} start
                     * @config  {Number} end
                     * @returns {Object} promise
                     */
                    list: function (aId, params) {
                        return listEvents(aId, params);
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
                        return getChart(aId, params).then(function (chartConfig) {
                            angular.forEach(chartConfig.measurements, formatMeasurement);

                            return chartConfig;
                        });
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
                },



                /**
                 * restart an agent
                 * @param   {String} aId
                 * @returns {Object} promise
                 */
                restart: function (aId) {
                    return restart(aId);
                }
            };
        }]);
})();
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
        
            function count(aId) {
                return request.get({
                    aId: aId,
                    nId: 'count'
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
                
                count: function (aId) {
                    return count(aId);
                },

                destroy: function (aId, nId) {
                    return destroy(aId, nId);
                }
            };
    }]);
})();
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
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentSetting', ['SeaRequest',
    function seaAgentSetting(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/setting/{key}'),
                remoteRequest = new SeaRequest('agent/{aId}/setting/{key}/remote');
        
            function update(setting) {
                return request.put(setting);
            }

            function list(aId) {
                return request.get({
                    aId: aId
                });
            }
        
            function remote(param) {
                return remoteRequest.get(param);
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
                },
                
                /**
                 * load settings from remote
                 * @param {Object} params
                 * @config {String} [aId]
                 * @config {String} [key]
                 * @config {String} [information]
                 */
                remote: function (param) {
                    return remote(param);
                }
            };
    }]);
})();
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
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentTag', ['SeaRequest',
    function seaAgentNote(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/tag/{tId}');

            function create(params) {
                return request.put(params);
            }

            function list(aId) {
                return request.get({
                    aId: aId
                });
            }

            function destroy(aId, tId) {
                return request.del({
                    aId: aId,
                    tId: tId
                });
            }

            return {
                /**
                 * add tag to agent
                 * @param {Object} params
                 * @config {String} [aId]
                 * @config {String} [tId]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function (aId) {
                    return list(aId);
                },

                destroy: function (aId, tId) {
                    return destroy(aId, tId);
                }
            };
    }]);
})();
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
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAuth', ['SeaRequest', 'seaConfig',
    function seaAuth(SeaRequest, seaConfig) {
            var request = new SeaRequest('auth/{action}');
            var requestMs = new SeaRequest(seaConfig.getMicroServiceUrl() + '/' + seaConfig.getMicroServiceApiVersion() + '/auth/{action}');

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

            function requestResetLink(params) {
                params = params || {};
                params.action = 'reset';

                return request.get(params);
            }
            
            function resetPassword(params) {
                params = params || {};
                params.action = 'reset';

                return request.post(params);
            }

            function token(params) {
                params = params || {};
                params.action = 'token';

                return requestMs.post(params);
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
                },
                
                requestResetLink: function (params) {
                    return requestResetLink(params);
                },

                resetPassword: function (params) {
                    return resetPassword(params);
                },

                token: function(params) {
                    return token(params);
                },
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaComplianceCheck', ['SeaRequest',
        function seaComplianceCheck(SeaRequest) {
            var request = new SeaRequest('compliance/check');

            function get(containerId, customerId, viewFilterId) {
                return request.get({
                    containerId: containerId,
                    customerId: customerId,
                    viewFilterId: viewFilterId
                });
            }

            return {
                get: function (containerId, customerId, viewFilterId) {
                    return get(containerId, customerId, viewFilterId);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCompliance', ['$q', 'SeaRequest', 'seaComplianceConfig', 'seaComplianceFix', 'seaComplianceViolation', 'seaComplianceCheck', 'seaRemotingIasHelper',
        function seaCompliance($q, SeaRequest, seaComplianceConfig, seaComplianceFix, seaComplianceViolation, seaComplianceCheck, helper) {
            return {
                config: seaComplianceConfig,
                fix: seaComplianceFix,
                violation: seaComplianceViolation,
                check: seaComplianceCheck
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaComplianceConfig', ['$q', 'SeaRequest', 'seaComplianceCustomer', 
        function seaComplianceConfig($q, SeaRequest, seaComplianceCustomer) {
            var request = new SeaRequest('compliance/config');

            function get(viewFilterId, customerId) {
                return request.get({
                    viewFilterId: viewFilterId,
                    customerId: customerId
                });
            }

            function update(viewFilterId, customerId, templateId, checks) {
                return request.put({
                    viewFilterId: viewFilterId,
                    customerId: customerId,
                    templateId: templateId,
                    checks: checks
                });
            }

            function destroy(viewFilterId, customerId) {
                return request.del({
                    viewFilterId: viewFilterId,
                    customerId: customerId
                });
            }

            function list(viewFilterIds, customerId) {
                var loopPromises = [];
                angular.forEach(viewFilterIds, function (viewFilterId) {
                    var deferred = $q.defer();
                    loopPromises.push(deferred.promise);
                    
                    get(viewFilterId, customerId).then(function (res) {
                        deferred.resolve(res);
                    }).catch(function (e) {
                        deferred.resolve(null);
                    });
                });

                return $q.all(loopPromises);
            }

            return {
                get: function (viewFilterId, customerId) {
                    return get(viewFilterId, customerId);
                },

                update: function (viewFilterId, customerId, templateId, checks) {
                    return update(viewFilterId, customerId, templateId, checks);
                },

                destroy: function (viewFilterId, customerId) {
                    return destroy(viewFilterId, customerId);
                },

                list: function (viewFilterIds, customerId) {
                    return list(viewFilterIds, customerId);
                },

                customer: seaComplianceCustomer
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaComplianceCustomer', ['$q', 'SeaRequest',
        function seaComplianceCustomer($q, SeaRequest) {
            var request = new SeaRequest('compliance/config/customer');

            function get(customerIds) {
                return request.get({
                    customerId: customerIds
                });
            }

            return {
                get: function (customerIds) {
                    return get(customerIds);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaComplianceFix', ['SeaRequest',
        function seaComplianceConfig(SeaRequest) {
            var request = new SeaRequest('compliance/fix');

            function update(changes) {
                return request.put({
                    changes: changes
                });
            }

            return {
                update: function (changes) {
                    return update(changes);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaComplianceViolation', ['SeaRequest',
        function seaComplianceViolation(SeaRequest) {
            var request = new SeaRequest('compliance/violation');

            function get(containerId, customerId, viewFilterId, messageFormat) {
                return request.get({
                    containerId: containerId,
                    customerId: customerId,
                    viewFilterId: viewFilterId,
                    messageFormat: messageFormat
                });
            }

            return {
                get: function (containerId, customerId, viewFilterId, messageFormat) {
                    return get(containerId, customerId, viewFilterId, messageFormat);
                }
            };
        }]);
})();
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
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerMisc', ['SeaRequest',
        function seaContainerMisc(SeaRequest) {
            var request = new SeaRequest('container/{cId}/{action}');

            function formatActionlog(entry) {
                entry.changeDate = new Date(entry.changeDate);
                entry.changed = JSON.parse(entry.changed);
                try {
                    entry.userName = JSON.parse(entry.userName);
                } catch (e) {
                    entry.userName = {
                        email: entry.userName,
                        sur: entry.userName
                    };
                }

                if (entry.information) {
                    try {
                        entry.information = JSON.parse(entry.information);
                    } catch (e) {
                        entry.information = null;
                    }
                }

                return entry;
            }

            function listActionlog(cId, params) {
                params = params || {};
                params.cId = cId;
                params.action = 'actionlog';
                return request.get(params);
            }

            function listEvents(cId, params) {
                params = params || {};
                params.cId = cId;
                params.action = 'events';
                return request.get(params);
            }

            function getInventory(cId, params) {
                params = params || {};
                params.cId = cId;
                params.action = 'inventory';
                return request.get(params);
            }

            function action(cId, action, params) {
                params = params || {};
                params.cId = cId;
                params.action = action;
                return request.post(params);
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
                        return listActionlog(cId, params).then(function (entries) {
                            angular.forEach(entries, formatActionlog);

                            return entries;
                        });
                    }
                },

                events: {
                    /**
                     * list action log entries
                     * @param   {String} cId
                     * @param   {Object} params
                     * @config  {Number} start
                     * @config  {Number} end
                     * @returns {Object} promise
                     */
                    list: function (cId, params) {
                        return listEvents(cId, params);
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
                    },

                    getFileLink: function (cId, params) {
                        params = params || {};
                        params.cId = cId;
                        params.action = 'inventory';

                        return request.formatUrl(params);
                    }
                },

                /**
                 * restart a container
                 * @param   {String} cId
                 * @returns {Object} promise
                 */
                restart: function (cId) {
                    return action(cId, 'restart');
                },

                /**
                 * stop a container
                 * @param   {String} cId
                 * @param   {Int}    until timestamp
                 * @returns {Object} promise
                 */
                stop: function (cId, until) {
                    return action(cId, 'stop', {
                        until: until
                    });
                },

                /**
                 * start a container
                 * @param   {String} cId
                 * @returns {Object} promise
                 */
                start: function (cId) {
                    return action(cId, 'start');
                }
            };
        }]);
})();
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

            function count(cId) {
                return request.get({
                    cId: cId,
                    nId: 'count'
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
                
                count: function (cId) {
                    return count(cId);
                },

                destroy: function (cId, nId) {
                    return destroy(cId, nId);
                }
            };
    }]);
})();
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
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerState', ['SeaRequest',
        function seaContainerState(SeaRequest) {
            var request = new SeaRequest('container/{cId}/state/{method}'),
                stateRequest = new SeaRequest('container/{cId}/state/{sId}'),
                hintRequest = new SeaRequest('container/{cId}/state/{sId}/hint');

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

            function stats(cId, params) {
                params = params || {};
                params.cId = cId;
                params.method = 'stats';

                return request.get(params);
            }

            function list(cId, params) {
                params = params || {};
                params.cId = cId;

                if (angular.isArray(params.cId)) {
                    return request.post(params, 'container/state').then(function (statesById) {
                        if (angular.isArray(statesById)) {
                            var n = {};
                            n[params.cId[0]] = statesById;
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

            function get(cId, sId, params) {
                params = params || {};
                params.sId = sId;
                params.cId = cId;

                return stateRequest.get(params).then(function (state) {
                    return formatState(state);
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
                },

                /**
              * get state by Id
              * @param   {String}   cId
              * @param   {String}   sId
              * @param {Object}
              * @config {Boolean} [includeHints]
              * @config {Boolean} [includeMessage]
              * @config {Boolean} [includeRawData]
              * @config {String} [format]
              */
                get: function (cId, sId, params) {
                    return get(cId, sId, params);
                },

                /**
                 * list container state stats
                 * @param   {String}   cId
                 * @param {Object}
                 * @config {Number} [start] : now
                 * @config {Number} [end]   : now - 12 months
                 */
                stats: function (cId, params) {
                    return stats(cId, params);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerTag', ['SeaRequest',
    function seaAgentNote(SeaRequest) {
            var request = new SeaRequest('container/{cId}/tag/{tId}');

            function create(params) {
                return request.put(params);
            }

            function list(cId) {
                return request.get({
                    cId: cId
                });
            }

            function destroy(cId, tId) {
                return request.del({
                    cId: cId,
                    tId: tId
                });
            }

            return {
                /**
                 * add tag to container
                 * @param {Object} params
                 * @config {String} [cId]
                 * @config {String} [tId]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function (cId) {
                    return list(cId);
                },

                destroy: function (cId, tId) {
                    return destroy(cId, tId);
                }
            };
    }]);
})();
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
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerApiKey', ['SeaRequest',
    function seaCustomerTag(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/apiKey/{apiKey}'),
                requestDistri = new SeaRequest('customer/apiKey/{apiKey}');

            function format(apiKey) {
                if(apiKey.validUntil) {
                    apiKey.validUntil = new Date(apiKey.validUntil);
                }
                
                if(apiKey.createdOn) {
                    apiKey.createdOn = new Date(apiKey.createdOn);
                }
                
                return apiKey;
            }
        
            function list(cId) {
                var p;
                
                if(!cId) {
                    p = requestDistri.get();
                } else {
                    p = request.get({
                        cId: cId
                    });
                }
                
                return p.then(function (apiKeys) {
                    angular.forEach(apiKeys, format);
                    
                    return apiKeys;
                });
            }
        
            function get(cId, query) {
                query = query || {};
                query.cId = cId;
                
                return request.get(query).then(format);
            }

            function destroy(cId, apiKey) {
                return request.del({
                    cId: cId,
                    apiKey: apiKey
                });
            }

            return {
                /**
                 * list all api keys of a customer or all your customers
                 * @param   {String} cId empty or customerId
                 */
                list: function (cId) {
                    return list(cId);
                },
                
                get: function (cId, query) {
                    return get(cId, query);
                },

                destroy: function (cId, apiKey) {
                    return destroy(cId, apiKey);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerBucket', ['SeaRequest',
    function seaCustomerDispatchTime(SeaRequest) {
            var request = new SeaRequest('customer/bucket/{bId}'),
                userRequest = new SeaRequest('customer/bucket/{bId}/user/{uId}');

            function create(params) {
                return request.post(params);
            }

            function list() {
                return request.get();
            }

            function update(bucket) {
                return request.put(bucket);
            }

            function destroy(bId) {
                return request.del({
                    bId: bId
                });
            }

            function listUser(bId) {
                return userRequest.get({
                    bId: bId
                });
            }

            function addUser(params) {
                return userRequest.put(params);
            }

            function removeUser(bId, uId) {
                return userRequest.del({
                    bId: bId,
                    uId: uId
                });
            }

            return {
                /**
                 * create bucket
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
                 * update bucket
                 * @param {Object} params
                 * @config {String} [bId]
                 * @config {String} [name]
                 */
                update: function (bucket) {
                    return update(bucket);
                },

                destroy: function (bId) {
                    return destroy(bId);
                },

                user: {
                    list: function (bId) {
                        return listUser(bId);
                    },

                    /**
                     * add user to bucket
                     * @param {Object} params
                     * @config {String} [bId]
                     * @config {String} [uId]
                     */
                    create: function (params) {
                        return addUser(params);
                    },

                    /**
                     * remove user from bucket
                     * @param {String} [bId]
                     * @param {String} [uId]
                     */
                    destroy: function (bId, uId) {
                        return removeUser(bId, uId);
                    }
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomer', ['SeaRequest', 'seaCustomerApiKey', 'seaCustomerBucket', 'seaCustomerDispatchTime', 'seaCustomerExternalCall', 'seaCustomerLocation', 'seaCustomerManager', 'seaCustomerProperty', 'seaCustomerSetting', 'seaCustomerTag', 'seaCustomerTemplate', 'seaCustomerUsage', 'seaCustomerViewFilter',
        function seaCustomer(SeaRequest, seaCustomerApiKey, seaCustomerBucket, seaCustomerDispatchTime, seaCustomerExternalCall, seaCustomerLocation, seaCustomerManager, seaCustomerProperty, seaCustomerSetting, seaCustomerTag, seaCustomerTemplate, seaCustomerUsage, seaCustomerViewFilter) {
            var request = new SeaRequest('customer/{cId}');
            var requestCreate = new SeaRequest('customer');

            function list() {
                return request.get();
            }

            function get(cId) {
                return request.get({
                    cId: cId
                });
            }

            function update(customer) {
                return request.put(customer);
            }
            
            function create(customer) {
                return requestCreate.post(customer);
            }

            return {
                list: function () {
                    return list();
                },

                get: function (cId) {
                    return get(cId);
                },

                /**
                 * update customer
                 * @param {Object} customer
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
                create: function (customer) {
                    return create(customer);
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

                apiKey: seaCustomerApiKey,
                bucket: seaCustomerBucket,
                dispatchTime: seaCustomerDispatchTime,
                externalCall: seaCustomerExternalCall,
                location: seaCustomerLocation,
                manager: seaCustomerManager,
                property: seaCustomerProperty,
                setting: seaCustomerSetting,
                tag: seaCustomerTag,
                template: seaCustomerTemplate,
                usage: seaCustomerUsage,
                viewFilter: seaCustomerViewFilter
            };
        }]);
})();
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
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerExternalCall', ['SeaRequest',
    function seaCustomerTag(SeaRequest) {
            var requestDistri = new SeaRequest('customer/externalCall');

            function format(ecall) {
                if(ecall.lastDate) {
                    ecall.lastDate = new Date(ecall.lastDate);
                }
                
                return ecall;
            }
        
            function list() {
                return requestDistri.get().then(function (ecalls) {
                    angular.forEach(ecalls, format);
                    
                    return ecalls;
                });
            }
        
            return {
                /**
                 * list all external url calls of your customers
                 */
                list: function () {
                    return list();
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerLocation', ['SeaRequest',
        function seaCustomerLocation(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/location');

            function get(cId) {
                return request.get({
                    cId: cId
                });
            }

            function update(params) {
                return request.post(params);
            }

            return {
                /**
                 * get location
                 * @param {String} cId
                 */
                get: function (cId) {
                    return get(cId);
                },

                /**
                 * update location
                 * @param {Object} params
                 * @config {String} [cId]
                 * @config {Object} [geo]
                 * @config {Number} [geo.lat]
                 * @config {Number} [geo.lon]
                 * @config {Object} [geo.address]
                 * @config {String} [geo.address.country]
                 * @config {String} [geo.address.state]
                 * @config {String} [geo.address.postcode]
                 * @config {String} [geo.address.city]
                 * @config {String} [geo.address.road]
                 * @config {String} [geo.address.house_number]
                 */
                update: function (params) {
                    return update(params);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerManager', ['SeaRequest',
    function seaCustomerTag(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/manager/{uId}');

            function list(cId) {
                return request.get({
                    cId: cId
                });
            }

            function addUser(cId, email) {
                return request.put({
                    cId: cId,
                    uId: email
                });
            }

            function removeUser(cId, uId) {
                return request.del({
                    cId: cId,
                    uId: uId
                });
            }

            return {
                list: function (cId) {
                    return list(cId);
                },

                /**
                 * add user as manager
                 * @param {Object} params
                 * @config {String} [cId]
                 * @config {String} [email] email address of the user
                 */
                add: function (cId, email) {
                    return addUser(cId, email);
                },

                remove: function (cId, uId) {
                    return removeUser(cId, uId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerProperty', ['SeaRequest',
    function seaCustomerProperty(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/property/{key}');
            var requestPost = new SeaRequest('customer/{cId}/property');

            function list(cId) {
                return request.get({
                    cId: cId
                });
            }

            function create(cId, key, value) {
                return requestPost.post({
                    cId: cId,
                    key: key,
                    value: value
                });
            }

            function destroy(cId, key) {
                return request.del({
                    cId: cId,
                    key: key
                });
            }

            return {
                list: function (cId) {
                    return list(cId);
                },

                /**
                 * add customer property
                 * @param {String} cId
                 * @param {String} key
                 * @param {String} value
                 */
                create: function (cId, key, value) {
                    return create(cId, key, value);
                },

                destroy: function (cId, key) {
                    return destroy(cId, key);
                }
            };
    }]);
})();
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
                return request.put(tag);
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
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerUsage', ['SeaRequest',
    function seaCustomerTag(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/usage'),
                requestDistri = new SeaRequest('customer/usage');

            function format(u) {
                if (u.date) {
                    u.date = new Date(u.date);
                }

                return u;
            }

            function list(year, month, cId) {
                var params = {
                    year: year,
                    month: month
                };

                if (cId) {
                    params.cId = cId;

                }

                return requestDistri.get(params).then(function (usage) {
                    angular.forEach(usage, format);

                    return usage;
                });
            }

            return {
                /**
                 * list the max usage of all customers or the usage graph of a specific customer
                 * @param   {Date} year of the required usage
                 * @param   {Date} month of the required usage
                 * @param   {String} cId empty or customerId
                 */
                list: function (year, month, cId) {
                    return list(year, month, cId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerViewFilter', ['SeaRequest',
    function seaCustomerDispatchTime(SeaRequest) {
            var request = new SeaRequest('customer/viewFilter/{vfId}');

            function create(params) {
                return request.post(params);
            }

            function list() {
                return request.get();
            }

            function update(viewFilter) {
                return request.put(viewFilter);
            }

            function destroy(vfId) {
                return request.del({
                    vfId: vfId
                });
            }

            return {
                /**
                 * create viewFilter
                 * @param {Object} params
                 * @config {String} [name]
                 * @config {Object} [query]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function () {
                    return list();
                },

                /**
                 * update viewFilter
                 * @param {Object} params
                 * @config {String} [vfId]
                 * @config {String} [name]
                 * @config {Object} [query]
                 */
                update: function (viewFilter) {
                    return update(viewFilter);
                },

                destroy: function (vfId) {
                    return destroy(vfId);
                }
            };
    }]);
})();
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
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMeLocation', ['SeaRequest',
        function seaMeLocation(SeaRequest) {
            var request = new SeaRequest('me/location');

            function get() {
                return request.get();
            }

            function update(params) {
                return request.post(params);
            }

            return {
                /**
                 * get location
                 */
                get: function (cId) {
                    return get(cId);
                },

                /**
                 * update location
                 * @param {Object} params
                 * @config {Object} [geo]
                 * @config {Number} [geo.lat]
                 * @config {Number} [geo.lon]
                 * @config {Object} [geo.address]
                 * @config {String} [geo.address.country]
                 * @config {String} [geo.address.state]
                 * @config {String} [geo.address.postcode]
                 * @config {String} [geo.address.city]
                 * @config {String} [geo.address.road]
                 * @config {String} [geo.address.house_number]
                 */
                update: function (params) {
                    return update(params);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMe', ['SeaRequest', 'seaMeLocation', 'seaMeMobilepush', 'seaMeNotification', 'seaMeTwoFactor', 'seaMeSetting',
        function seaMe(SeaRequest, seaMeLocation, seaMeMobilepush, seaMeNotification, seaMeTwoFactor, seaMeSetting) {
            var request = new SeaRequest('me/{action}');

            function _formatNode(node) {
                ['date', 'lastDate', 'silencedUntil'].forEach(function (key) {
                    if (node[key] && typeof (node[key]) === 'string') {
                        node[key] = new Date(node[key]);
                    }
                });

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

            function updatePassword(params) {
                params = angular.extend({}, { action: 'password' }, params);
                return request.put(params);
            }

            return {
                me: me,
                password: {
                    update: function (params) {
                        return updatePassword(params);
                    },
                },
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

                location: seaMeLocation,
                mobilepush: seaMeMobilepush,
                notification: seaMeNotification,
                twofactor: seaMeTwoFactor,
                setting: seaMeSetting
            };
        }]);
})();
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
                 * @config  {Boolean}  type
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
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMeSetting', ['SeaRequest',
    function seaMeSetting(SeaRequest) {
            var request = new SeaRequest('me/setting');
            var requestAction = new SeaRequest('me/setting/{action}');

            function list() {
                return request.get();
            }

            function update(settings) {
                settings = settings || {};
                return request.put(settings);
            }

            function resetSecret(password) {
                return requestAction.post({
                    action: 'secret/reset',
                    password: password,
                });
            }

            return {
                list: function (uId) {
                    return list(uId);
                },

                /**
                 * update user
                 * @param {Object} settings
                 */
                update: function (settings) {
                    return update(settings);
                },

                secret: {
                    reset: function(password) {
                        return resetSecret(password);
                    }
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMeTwoFactor', ['SeaRequest',
        function seaMeLocation(SeaRequest) {
            var request = new SeaRequest('me/twofactor/{sub}');

            function get() {
                return request.get();
            }

            function getSecret(params) {
                params = params || {};
                params.sub = 'secret';
                return request.get(params);
            }

            function enable(params) {
                return request.post(params);
            }

            function disable(params) {
                return request.del(params);
            }

            return {
                /**
                 * is two-factor enabled
                 */
                isEnabled: function () {
                    return get();
                },

                /**
                 * enable two-factor authentication
                 * @param   {Object} params
                 * @config  {string}  format
                 * @returns {Object} promise
                 */
                getSecret: function (params) {
                    return getSecret(params);
                },

                /**
                 * enable two-factor authentication
                 * @param   {Object} params
                 * @config  {string}  password
                 * @config  {string}  code
                 * @returns {Object} promise
                 */
                enable: function (params) {
                    return enable(params);
                },

                /**
                 * disable two-factor authentication
                 * @param   {Object} params
                 * @config  {string}  password
                 * @config  {string}  code
                 * @returns {Object} promise
                 */
                disable: function (params) {
                    return disable(params);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatchContainer', ['SeaRequest', 'seaPatchHelper',
        function seaUser(SeaRequest, seaPatchHelper) {
            var request = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/container/{cId}')),
                requestAction = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/container/{cId}/{action}')),
                requestPatchJobs = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/container/{cId}/patch/{patchId}/jobs')),
                requestPatch = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/container/{cId}/patch/{patchId}'));

            function get(customerId, cId, action, queryParameters) {
                if (action) {
                    var params = {
                        customerId: customerId,
                        cId: cId,
                        action: action,
                    };

                    if (queryParameters) {
                        params = angular.extend({}, params, queryParameters);
                    }

                    return requestAction.get(params);
                }

                return request.get({
                    customerId: customerId,
                    cId: cId,
                });
            }

            function enable(customerId, cId) {
                return requestAction.post({
                    customerId: customerId,
                    cId: cId,
                    action: 'enable',
                });
            }

            function disable(customerId, cId) {
                return requestAction.post({
                    customerId: customerId,
                    cId: cId,
                    action: 'disable',
                });
            }

            function getJobsByPatchId(customerId, cId, queryParameters, patchId) {
                var params = {
                    customerId: customerId,
                    cId: cId,
                    patchId: patchId,
                };
                if (queryParameters) {
                    params = angular.extend({}, params, queryParameters);
                }
                return requestPatchJobs.get(params);
            }

            function getPatchById(customerId, cId, patchId) {
                return requestPatch.get({
                    customerId: customerId,
                    cId: cId,
                    patchId: patchId,
                });
            }

            return {
                get: function (customerId, cId) {
                    return get(customerId, cId);
                },
                enable: function (customerId, cId) {
                    return enable(customerId, cId);
                },
                disable: function (customerId, cId) {
                    return disable(customerId, cId);
                },
                category: {
                    list: function (customerId, cId) {
                        return get(customerId, cId, 'categories');
                    }
                },
                job: {
                    list: function (customerId, cId, queryParameters) {
                        return get(customerId, cId, 'jobs', queryParameters);
                    },
                    get: function(customerId, cId, patchId) {
                        return getPatchById(customerId, cId, patchId);
                    },
                    history: function (customerId, cId, queryParameters) {
                        return get(customerId, cId, 'jobs/history', queryParameters);
                    },
                },
                patch: {
                    list: function (customerId, cId, queryParameters) {
                        return get(customerId, cId, 'patches', queryParameters);
                    },
                    get: function (customerId, cId, patchId) {
                        return getPatchById(customerId, cId, patchId);
                    },
                    history: function (customerId, cId, queryParameters) {
                        return get(customerId, cId, 'patches/history', queryParameters);
                    },
                    job: {
                        list: function (customerId, cId, queryParameters, patchId) {
                            return getJobsByPatchId(customerId, cId, queryParameters, patchId);
                        },
                    },
                },
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatchHelper', ['seaConfig',
    function (seaConfig) {        
            function getUrl(path) {
                return [seaConfig.getPmUrl(), path].join('/');
            }

            return {
                getUrl: getUrl
            };
    }]);
})();

(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatchHelperMicroService', ['seaConfig',
    function (seaConfig) {        
            function getUrl(path) {
                return [seaConfig.getMicroServiceUrl(), seaConfig.getMicroServiceApiVersion(), 'smart-updates', path].join('/');
            }

            return {
                getUrl: getUrl
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatch', ['SeaRequest', 'seaPatchContainer', 'seaPatchViewFilter', 'seaPatchHelper', 'seaPatchTask',
        function seaUser(SeaRequest, seaPatchContainer, seaPatchViewFilter, seaPatchHelper, seaPatchTask) {
            var request = new SeaRequest(seaPatchHelper.getUrl('patch/customers')),
                requestCategories = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/categories'));

            function listCustomers() {
                return request.get();
            }

            function listCategories(customerId) {
                return requestCategories.get({ customerId: customerId });
            }

            return {
                customer: {
                    list: listCustomers
                },
                category: {
                    list: function (customerId) {
                        return listCategories(customerId)
                    },
                },
                container: seaPatchContainer,
                viewFilter: seaPatchViewFilter,
                task: seaPatchTask,
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatchTask', ['SeaRequest', 'seaPatchHelperMicroService',
        function (SeaRequest, seaPatchHelper) {
            var request = new SeaRequest(seaPatchHelper.getUrl('tasks/{taskId}'));
            var requestList = new SeaRequest(seaPatchHelper.getUrl('tasks/list'));

            function list(containerIds) {
                return requestList.post({
                    containerIds: containerIds,
                });
            }

            function destroy(taskId) {
                return request.del({
                    taskId: taskId,
                });
            }

            function create(params) {
                return request.post(params);
            }

            function update(params) {
                return request.put(params);
            }

            return {
                list: function (containerIds) {
                    return list(containerIds);
                },
                destroy: function (taskId) {
                    return destroy(taskId);
                },
                /**
                 * create smart updates task
                 * @param {Object} params
                 * @config {Array<String>} containerIds
                 * @config {Array<String>} trigger
                 * @config {<String>} action shutdown or restart
                 */
                create: function (params) {
                    return create(params);
                },
                /**
                 * update smart updates task
                 * @param {Object} params
                 * @config {String} taskId
                 * @config {Array<String>} [trigger]
                 * @config {String} [name]
                 * @config {String} [description]
                 * @config {<String>} [action] shutdown or restart
                 */
                update: function (params) {
                    return update(params);
                },
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatchViewFilter', ['SeaRequest', 'seaPatchHelper',
        function seaUser(SeaRequest, seaPatchHelper) {
            var request = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/viewFilters')),
                requestVf = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/viewFilter/{vfId}/{action}')),
                requestPost = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/viewFilter')),
                requestDel = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/viewFilter/{vfId}'));

            function get(customerId, vfId, action, queryParameters) {
                if (vfId) {
                    var params = {
                        customerId: customerId,
                        vfId: vfId,
                        action: action,
                    };

                    if (queryParameters) {
                        params = angular.extend({}, params, queryParameters);
                    }

                    return requestVf.get(params);
                }

                return request.get({
                    customerId: customerId,
                });
            }

            function post(customerId, vfId, body, action) {
                if (vfId) {
                    var params = angular.extend({}, { customerId: customerId, vfId: vfId, action: action }, body);
                    return requestVf.post(params);
                }

                var params = angular.extend({}, { customerId: customerId }, body);
                return requestPost.post(params);
            }

            function del(customerId, vfId) {
                return requestDel.del({ customerId: customerId, vfId: vfId });
            }

            return {
                list: function (customerId) {
                    return get(customerId);
                },
                create: function (customerId, body) {
                    return post(customerId, false, body);
                },
                destroy: function (customerId, vfId) {
                    return del(customerId, vfId);
                },
                container: {
                    list: function (customerId, vfId) {
                        return get(customerId, vfId, 'containers');
                    }
                },
                job: {
                    list: function (customerId, vfId, queryParameters) {
                        return get(customerId, vfId, 'jobs', queryParameters);
                    },
                    history: function (customerId, vfId, queryParameters) {
                        return get(customerId, vfId, 'jobs/history', queryParameters);
                    },
                },
                patch: {
                    list: function (customerId, vfId, queryParameters) {
                        return get(customerId, vfId, 'patches', queryParameters);
                    },
                    history: function (customerId, vfId, queryParameters) {
                        return get(customerId, vfId, 'patches/history', queryParameters);
                    },
                },
                setting: {
                    list: function (customerId, vfId) {
                        return get(customerId, vfId, 'settings');
                    },

                    update: function (customerId, vfId, body) {
                        return post(customerId, vfId, body, 'settings');
                    }
                },

            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPowerShellHelper', ['seaConfig',
        function (seaConfig) {
            function getUrl(path) {
                return [seaConfig.getMicroServiceUrl(), seaConfig.getMicroServiceApiVersion(), 'powershell', path].join('/');
            }

            return {
                getUrl: getUrl
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPowerShellRepository', ['SeaRequest', 'seaPowerShellHelper', 'seaPowerShellRepositoryScript', 'seaPowerShellRepositoryUser', 'seaPowerShellRepositoryUtil',
        function (SeaRequest, seaPowerShellHelper, seaPowerShellRepositoryScript, seaPowerShellRepositoryUser, seaPowerShellRepositoryUtil) {
            var request = new SeaRequest(seaPowerShellHelper.getUrl('repository'));
            var requestRepository = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repositoryId}'));

            function listRepositories() {
                return request.get();
            }

            function get(repositoryId) {
                return requestRepository.get({
                    repositoryId: repositoryId,
                });
            }

            function create(params) {
                return request.post(params);
            }

            function update(params) {
                return requestRepository.put(params);
            }

            function destroy(repositoryId) {
                return requestRepository.del({
                    repositoryId: repositoryId,
                });
            }

            return {
                list: function () {
                    return listRepositories();
                },
                get: function (repositoryId) {
                    return get(repositoryId);
                },
                /**
                 * create repository
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String} [distributorId]
                 * @config {String} name
                 * @config {String} [description]
                 */
                create: function (params) {
                    return create(params);
                },
                /**
                 * update repository
                 * @param {Object} params
                 * @config {String} repositoryId
                 * @config {String} [customerId]
                 * @config {String} [distributorId]
                 * @config {String} name
                 * @config {String} [description]
                 */
                update: function (params) {
                    return update(params);
                },
                destroy: function (repositoryId) {
                    return destroy(repositoryId);
                },

                script: seaPowerShellRepositoryScript,
                user: seaPowerShellRepositoryUser,
                util: seaPowerShellRepositoryUtil,
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPowerShellRepositoryScript', ['SeaRequest', 'seaPowerShellHelper',
        function (SeaRequest, seaPowerShellHelper) {
            var request = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repositoryId}/script'));
            var requestScripts = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repositoryId}/scripts'));
            var requestScript = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repositoryId}/script/{scriptId}'));

            function listScripts() {
                return requestScripts.get();
            }

            function get(repositoryId, scriptId) {
                return requestScript.get({
                    repositoryId: repositoryId,
                    scriptId: scriptId,
                });
            }

            function create(params) {
                return request.post(params);
            }

            function update(params) {
                return requestScript.put(params);
            }

            function destroy(repositoryId, scriptId) {
                return requestScript.del({
                    repositoryId: repositoryId,
                    scriptId: scriptId,
                });
            }

            return {
                list: function () {
                    return listScripts();
                },
                get: function (repositoryId, scriptId) {
                    return get(repositoryId, scriptId);
                },
                /**
                 * create script
                 * @param {Object} params
                 * @config {String} repositoryId
                 * @config {String} name
                 * @config {String} [description]
                 * @config {String} script
                 */
                create: function (params) {
                    return create(params);
                },
                /**
                 * update script
                 * @param {Object} params
                 * @config {String} repositoryId
                 * @config {String} scriptId
                 * @config {String} name
                 * @config {String} [description]
                 * @config {String} script
                 */
                update: function (params) {
                    return update(params);
                },
                destroy: function (repositoryId, scriptId) {
                    return destroy(repositoryId, scriptId);
                },
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPowerShellRepositoryUser', ['SeaRequest', 'seaPowerShellHelper',
        function (SeaRequest, seaPowerShellHelper) {
            var request = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repositoryId}/user/{userId}'));

            function add(params) {
                return request.post(params);
            }

            function update(params) {
                return request.put(params);
            }

            function remove(repositoryId, userId) {
                return request.del({
                    repositoryId: repositoryId,
                    userId: userId,
                });
            }

            return {
                /**
                 * add user
                 * @param {Object} params
                 * @config {String} repositoryId
                 * @config {String} userId
                 * @config {'ADMIN' | 'EDITOR' | 'READER'} role
                 */
                add: function (params) {
                    return add(params);
                },
                /**
                 * update user
                 * @param {Object} params
                 * @config {String} repositoryId
                 * @config {String} userId
                 * @config {'ADMIN' | 'EDITOR' | 'READER'} role
                 */
                update: function (params) {
                    return update(params);
                },
                remove: function (repositoryId, userId) {
                    return remove(repositoryId, userId);
                },
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPowerShellRepositoryUtil', ['SeaRequest', 'seaPowerShellHelper',
        function (SeaRequest, seaPowerShellHelper) {
            var parseRequest = new SeaRequest(seaPowerShellHelper.getUrl('script/parse'));
            var agentsRequest = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repositoryId}/script/{scriptId}/agent'));
            var settingRequest = new SeaRequest(seaPowerShellHelper.getUrl('repository/agent/setting'));
            var agentScriptRequest = new SeaRequest(seaPowerShellHelper.getUrl('repository/script/agent/{agentId}'));
            var taskScriptRequest = new SeaRequest(seaPowerShellHelper.getUrl('repository/script/scheduled/task/{taskId}'));
            var tasksRequest = new SeaRequest(seaPowerShellHelper.getUrl('repository/{powerShellRepositoryId}/script/{powerShellRepositoryScriptId}/scheduled-task'));

            function parseScript(script) {
                return parseRequest.post(script);
            }

            function listAgents(repositoryId, scriptId) {
                return agentsRequest.get({
                    repositoryId: repositoryId,
                    scriptId: scriptId,
                });
            }
            
            function listTasks(repositoryId, scriptId) {
                return tasksRequest.get({
                    powerShellRepositoryId: repositoryId,
                    powerShellRepositoryScriptId: scriptId,
                });
            }

            function getScriptByAgent(agentId) {
                return agentScriptRequest.get({
                    agentId: agentId,
                });
            }

            function updateSettings(params) {
                return settingRequest.put({
                    powerShellRepositoryId: params.repositoryId,
                    powerShellRepositoryScriptId: params.scriptId,
                    agentId: params.agentId,
                });
            }

            function getScriptByTaskId(taskId) {
                return taskScriptRequest.get({
                    taskId: taskId,
                });
            }

            return {
                parseScript: function (script) {
                    return parseScript(script);
                },
                listAgents: function (repositoryId, scriptId) {
                    return listAgents(repositoryId, scriptId);
                },
                listTasks: function (repositoryId, scriptId) {
                    return listTasks(repositoryId, scriptId);
                },
                getScriptByAgent: function (agentId) {
                    return getScriptByAgent(agentId);
                },
                /**
                * update agent settings
                * @param {Object} params
                * @config {String} repositoryId
                * @config {String} scriptId
                * @config {String} agentId
                */
                updateSettings: function (params) {
                    return updateSettings(params);
                },
                getScriptByTaskId: function (taskId) {
                    return getScriptByTaskId(taskId);
                },
            }
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingAntivirus', ['$http', 'SeaRequest', 'seaRemotingIasHelper',
    function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest(helper.getUrl('seias/rest/seocc/virus/1.0/{section}/{action}'));

            function format(container) {
                if (!container.EventList) {
                    return container;
                }

                container.EventList.forEach(function (job) {
                    ['Timestamp'].forEach(function (key) {
                        if (job[key]) {
                            job[key] = new Date(job[key]);
                        }
                    });
                });

                return container;
            }

            function activate(params) {
                var customerId = params.customerId,
                    containerConfig = params.containerConfig;

                if (!angular.isArray(containerConfig)) {
                    containerConfig = [containerConfig];
                }

                containerConfig = containerConfig.map(function (c) {
                    return {
                        ContainerId: c.containerId,
                        Token: c.token
                    };
                });

                return request.post({
                    section: 'container',
                    ContainerList: containerConfig
                });
            }

            function get(customerId, cId) {
                return list(customerId, [cId]);
            }

            function list(customerId, containerIds) {
                var query = helper.getContainerIds(containerIds);
                query.section = 'container';
                query.action = 'get';
                
                return request.post(query);
            }
        
            function getEvents(customerId, cId, paging) {
                return listEvents(customerId, [cId], paging).then(function (history) {
                    return (history[0] || {}).EventList;
                });
            }

            function listEvents(customerId, containerIds, paging) {
                var query = helper.getContainerIds(containerIds);
                query.section = 'event';
                query.action = 'get';

                if (paging) {
                    query.Index = paging.index;
                    query.Count = paging.count;
                }

                return request.post(query).then(function (containers) {
                    containers.forEach(format);
                    return containers;
                });
            }
        
            function checkEvents(customerId, containerIds, eventIds) {
                var query = helper.getEventIds(eventIds);
                query.section = 'event';
                query.action = 'check';
                
                return request.post(query);
            }

            return {
                get: function (customerId, cId) {
                    return get(customerId, cId);
                },

                list: function (customerId, containerIds) {
                    return list(customerId, containerIds);
                },

                /**
                 * activate antivirus on a client
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {Array|Object} [containerConfig]
                 * @config {String} [config.id]
                 * @config {String} [config.token]
                 */
                activate: function (params) {
                    return activate(params);
                },

                event: {
                    get: function (customerId, cId, paging) {
                        return getEvents(customerId, cId, paging);
                    },

                    list: function (customerId, containerIds, paging) {
                        return getEvents(customerId, containerIds, paging);
                    },
                    
                    check: function (customerId, containerIds, eventIds) {
                        return checkEvents(customerId, containerIds, eventIds);
                    }
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingIasHelper', [ '$q', 'seaConfig',
    function seaRemotingPcvisit($q, seaConfig) {
            function getContainerIds(containerIds) {
                return convertIds(containerIds, 'ContainerIdList', 'ContainerId');
            }

            function getSoftwareIds(softwareIds) {
                return convertIds(softwareIds, 'SoftwareIdList', 'SoftwareId');
            }

            function getJobIds(jobIds) {                
                return convertIds(jobIds, 'JobIdList', 'JobId');
            }
        
            function getEventIds(eventIds) {
                return convertIds(eventIds, 'EventIdList', 'EventId');
            }
        
            function convertIds(ids, rootName, subName) {
                if (!angular.isArray(ids)) {
                    ids = [ids];
                }

                var query = ids.map(function (id) {
                    var o = {};
                    o[subName] = id;
                    return o;
                });

                var o = {};
                o[rootName] = query;
                
                return o;
            }

            function idListResult(result) {
                if (result.Msg == 'success') {
                    return $q.resolve(result.IdList.map(function (entry) {
                        return entry.Id;
                    }));
                }

                return $q.reject(new Error(result.Msg));
            }
        
            function getUrl(path) {
                return [seaConfig.getPatchUrl(), path].join('/');
            }

            return {
                getContainerIds: getContainerIds,
                getSoftwareIds: getSoftwareIds,
                getJobIds: getJobIds,
                getEventIds: getEventIds,
                idListResult: idListResult,
                getUrl: getUrl
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingNetwork', ['SeaRequest',
    function seaRemotingPcvisit(SeaRequest) {
            var request = new SeaRequest('network/{customerId}/{cId}/system/{action}');

            function format(job) {
                if (job && job.createdAt) {
                    job.createdAta = new Date(job.createdAt);
                }

                return job;
            }

            function list(params) {
                return request.get(params);
            }

            function install(params) {
                return request.post(params);
            }
        
            function getInstallStatus(params) {
                params = params || {};
                
                var customerId = params.customerId,
                    cId = params.cId,
                    version = params.version,
                    jobIds = params.jobIds;
                
                return request.get({
                    customerId: customerId,
                    cId: cId,
                    action: 'installstatus',
                    v: version,
                    jobIds: jobIds
                }).then(function (jobs) {
                   jobs.forEach(format);
                    return jobs;
                });
            }

            return {
                system: {
                    /**
                     * list active directory of OCC Connector
                     * @param {Object} params
                     * @config {String} [customerId]
                     * @config {String} [cId] ID of the OCC Connector
                     * @config {String} [user]
                     * @config {String} [domain]
                     * @config {String} [password]
                     */
                    list: function (params) {
                        return list(params);
                    },

                    /**
                     * install Server-Eye on remote system
                     * @param {Object} params
                     * @config {String} [customerId]
                     * @config {String} [cId] ID of the OCC Connector
                     * @config {String} [user]
                     * @config {String} [domain]
                     * @config {String} [password]
                     * @config {String} [host] Name of the host Server-Eye will be installed on
                     */
                    install: function (params) {
                        return install(params);
                    },

                    /**
                     * get the install status of install jobs
                     * @param {Object} params
                     * @config {String} [customerId]
                     * @config {String} [cId] ID of the OCC Connector
                     * @config {Array}  [jobIds]
                     * @config {Integer} [version] remote install version
                     */
                    installStatus: function (params) {
                        return getInstallStatus(params);
                    }
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatch', ['$http', 'SeaRequest', 'seaRemotingIasHelper', 'seaRemotingPatchHistory', 'seaRemotingPatchInstall', 'seaRemotingPatchReboot', 'seaRemotingPatchScan', 'seaRemotingPatchSoftware',
    function seaRemotingPcvisit($http, SeaRequest, helper, seaRemotingPatchHistory, seaRemotingPatchInstall, seaRemotingPatchReboot, seaRemotingPatchScan, seaRemotingPatchSoftware) {
            var request = new SeaRequest(helper.getUrl('seias/rest/seocc/patch/1.0/container/{section}/{action}'));
            var dateKeys = ["LastScanTime", "LastInstallJobTime", "NextInstallJobTime"];
        
            function format(container) {
                dateKeys.forEach(function (key) {
                    if(container[key]) {
                        container[key] = new Date(container[key]);
                    }
                });
                
                return container;
            }
                
            function get(customerId, cId) {
                return list(customerId, [cId]);
            }

            function list(customerId, containerIds) {
                var query = helper.getContainerIds(containerIds);
                query.action = 'get';
                
                return request.post(query).then(function (containers) {
                    containers.forEach(format);
                    return containers;
                });
            }
                
            function activate(params) {
                var customerId = params.customerId,
                    containerConfig = params.containerConfig,
                    cron = params.cron;
                
                if(!angular.isArray(containerConfig)) {
                    containerConfig = [ containerConfig ];
                }
                
                containerConfig = containerConfig.map(function (c) {
                    return {
                        ContainerId: c.containerId,
                        Token: c.token
                    };
                });
                
                return request.post({
                    ContainerList: containerConfig,
                    Cron: cron
                });
            }
        
            function destroy(customerId, containerIds) {
                var query = helper.getContainerIds(containerIds);
                
                return request.del(query)
            }

            return {
                get: function (customerId, cId) {
                    return get(customerId, cId);
                },

                list: function (customerId, containerIds) {
                    return list(customerId, containerIds);
                },
                
                /**
                 * activate patchmanagement on a client
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {Array|Object} [containerConfig]
                 * @config {String} [config.id]
                 * @config {String} [config.token]
                 * @config {String} [cron]
                 */
                activate: function (params) {
                    return activate(params);
                },
                deactivate: function (customerId, containerIds) {
                    return destroy(customerId, containerIds);
                },
                
                history: seaRemotingPatchHistory,
                install: seaRemotingPatchInstall,
                reboot: seaRemotingPatchReboot,
                scan: seaRemotingPatchScan,
                software: seaRemotingPatchSoftware
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPcvisit', ['SeaRequest',
    function seaRemotingPcvisit(SeaRequest) {
            var request = new SeaRequest('pcvisit/{customerId}/{cId}/{action}');

            function format(access) {
                if(access && access.date) {
                    access.data = new Date(access.date);
                }
                
                return access;
            }
        
            function get(customerId, cId) {
                return request.get({
                    customerId: customerId,
                    cId: cId
                }).then(function (system) {
                    format(system.lastAccess);
                    return system;
                });
            }
        
            function start(params) {
                params = params || {};
                params.action = 'start';
                
                return request.post(params);
            }

            function isInstalled(customerId, cId) {
                return request.get({
                    customerId: customerId,
                    cId: cId,
                    action: 'check'
                });
            }

            return {
                get: function(customerId, cId) {
                    return get(customerId, cId);
                },
                
                /**
                 * install pcvisit on remote system
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String} [cId]
                 * @config {String} [supporterId]
                 * @config {String} [supporterPassword]
                 * @config {String} [user]
                 * @config {String} [domain]
                 * @config {String} [password]
                 */
                installAndStart: function (params) {
                    return start(params);
                },
                
                isInstalled: function (customerId, cId) {
                    return isInstalled(customerId, cId);
                },
                
                getConnectFileLink: function (customerId, cId) {
                    return request.formatUrl({
                        customerId: customerId,
                        cId: cId,
                        action: 'file'
                    });
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPowershell', ['SeaRequest',
    function seaRemotingPowershell(SeaRequest) {
            var request = new SeaRequest('powershell/{customerId}/{cId}/{action}');
        
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
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemoting', ['SeaRequest', 'seaRemotingPcvisit', 'seaRemotingNetwork', 'seaRemotingAntivirus', 'seaRemotingPatch', 'seaRemotingPowershell',
        function seaRemoting(SeaRequest, seaRemotingPcvisit, seaRemotingNetwork, seaRemotingAntivirus, seaRemotingPatch, seaRemotingPowershell) {
            var shutdownRequest = new SeaRequest('shutdown/{customerId}/{containerId}');

            function shutdown(customerId, containerId, credentials, force, reboot) {
                return shutdownRequest.post({
                    customerId: customerId,
                    containerId: containerId,
                    force: force,
                    reboot: reboot,
                    user: credentials.user,
                    password: credentials.password,
                    domain: credentials.domain,
                });
            }

            return {
                antivirus: seaRemotingAntivirus,
                pcvisit: seaRemotingPcvisit,
                powershell: seaRemotingPowershell,
                network: seaRemotingNetwork,
                patch: seaRemotingPatch,
                shutdown: function (customerId, containerId, credentials, force, reboot) {
                    return shutdown(customerId, containerId, credentials, force, reboot);
                }
            };
        }]);
})();

(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaReporting', ['SeaRequest', 'seaReportingTemplate',
    function seaCustomer(SeaRequest, seaReportingTemplate) {
            var request = new SeaRequest('reporting/{cId}/report'),
                reportRequest = new SeaRequest('reporting/{cId}/report/{rId}');

            function formatReport(report) {
                ['startDate', 'lastDate', 'nextDate'].forEach(function (prop) {
                    if(report[prop]) {
                        report[prop] = new Date(report[prop]);
                    }
                });
                
                if(report.history) {
                    report.history.forEach(function (generated) {
                        generated.generatedDate = new Date(generated.generatedDate);
                    });
                }
                
                return report;
            }
        
            function create(params) {
                return request.post(params);
            }
        
            function list(cId) {
                return request.get({
                    cId: cId
                }).then(function (reports) {
                    reports.forEach(formatReport);
                    return reports;
                });
            }
        
            function listTypes(cId) {
                return reportRequest.get({
                    cId: cId,
                    rId: 'type'
                });
            }

            function get(cId, rId) {
                return reportRequest.get({
                    cId: cId,
                    rId: rId
                }).then(function (report) {
                    return formatReport(report);
                });
            }
        
            function destroy(cId, rId) {
                return reportRequest.del({
                    cId: cId,
                    rId: rId
                });
            }

            return {
                list: function (cId) {
                    return list(cId);
                },

                type: {
                    list: function (cId) {
                        return listTypes(cId);
                    }
                },
                
                report: {
                    get: function (cId, rId) {
                        return get(cId, rId);
                    },
                    
                    /**
                     * create report
                     * @param {Object} params
                     * @config {String} [cId]
                     * @config {String} [rtId]
                     * @config {String} [repeatCron]
                     * @config {String} [recipients]
                     */
                    create: function(params) {
                        return create(params);
                    },
                    
                    destroy: function (cId, rId) {
                        return destroy(cId, rId);
                    }
                },

                template: seaReportingTemplate
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaReportingTemplate', ['SeaRequest',
        function seaReportingTemplate(SeaRequest) {
            var request = new SeaRequest('reporting/template/{rtId}');

            function create(params) {
                return request.post(params);
            }

            function list() {
                return request.get();
            }

            function get(rId) {
                return reportRequest.get({
                    rtId: rtId
                });
            }

            function destroy(rId) {
                return reportRequest.del({
                    rtId: rtId
                });
            }

            return {
                list: function (cId) {
                    return list(cId);
                },

                get: function (rtId) {
                    return get(rtId);
                },

                /**
                 * create report template
                 * @param {Object} params
                 * @config {String} [name]
                 * @config {Array} [widgets]
                 */
                create: function (params) {
                    return create(params);
                },

                destroy: function (rtId) {
                    return destroy(rtId);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaScheduledTasksHelper', ['seaConfig',
        function (seaConfig) {
            function getUrl(path) {
                return [seaConfig.getMicroServiceUrl(), seaConfig.getMicroServiceApiVersion(), 'scheduled', path].join('/');
            }

            return {
                getUrl: getUrl
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaScheduledTasks', ['SeaRequest', 'seaScheduledTasksHelper', 'seaScheduledTasksTask', 'seaScheduledTasksUtil',
        function (SeaRequest, seaScheduledTasksHelper, seaScheduledTasksTask, seaScheduledTasksUtil) {
            var customerRequest =  new SeaRequest(seaScheduledTasksHelper.getUrl('task/customer/{customerId}'));
            var containerRequest = new SeaRequest(seaScheduledTasksHelper.getUrl('task/container/{containerId}'));

            function getByContainerId(containerId) {
                return containerRequest.get({
                    containerId: containerId,
                });
            }
            
            function getByCustomerId(customerId) {
                return customerRequest.get({
                    customerId: customerId,
                });
            }

            return {
                customer: {
                    list: function (customerId) {
                        return getByCustomerId(customerId);
                    },
                },
                container: {
                    list: function (containerId) {
                        return getByContainerId(containerId)
                    },
                },
                task: seaScheduledTasksTask,
                util: seaScheduledTasksUtil,
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaScheduledTasksTask', ['SeaRequest', 'seaScheduledTasksHelper',
        function (SeaRequest, seaScheduledTasksHelper) {
            var request = new SeaRequest(seaScheduledTasksHelper.getUrl('task'));
            var requestTask = new SeaRequest(seaScheduledTasksHelper.getUrl('task/{taskId}'));
            var requestTaskAction = new SeaRequest(seaScheduledTasksHelper.getUrl('task/{taskId}/{action}'));

            function get(taskId) {
                return requestTask.get({
                    taskId: taskId,
                });
            }

            function create(params) {
                return request.post(params);
            }

            function update(params) {
                return requestTask.put(params);
            }

            function destroy(taskId, detach) {
                return requestTask.del({
                    taskId: taskId,
                    detach: detach,
                });
            }

            function copy(params) {
                params = angular.extend({}, params, { action: 'copy' });
                return requestTaskAction.post(params);
            }

            return {
                get: function (taskId) {
                    return get(taskId);
                },
                /**
                 * create task
                 * @param {Object} params
                 * @config {String} containerId
                 * @config {String} customerId
                 * @config {String} name
                 * @config {Array<String>} triggers
                 * @config {String} [description]
                 * @config {String} [powerShellRepositoryId]
                 * @config {String} [powerShellRepositoryScriptId]
                 * @config {String} [scriptData]
                 * @config {String} [arguments]
                 */
                create: function (params) {
                    return create(params);
                },
                /**
                 * update task
                 * @param {Object} params
                 * @config {String} taskId
                 * @config {String} name
                 * @config {Array<String>} triggers
                 * @config {String} [description]
                 * @config {String} [powerShellRepositoryId]
                 * @config {String} [powerShellRepositoryScriptId]
                 * @config {String} [scriptData]
                 * @config {String} [arguments]
                 * @config {Boolean} [detach]
                 */
                update: function (params) {
                    return update(params);
                },
                /**
                 * destroy task
                 * @param {String} taskId
                 * @param {Boolean} [detach]
                 */
                destroy: function (taskId, detach) {
                    return destroy(taskId, detach);
                },
                /**
                 * copy task
                 * @param {Object} params
                 * @config {String} taskId
                 * @config {Array<String>} containerIds
                 */
                copy: function (params) {
                    return copy(params);
                },
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaScheduledTasksUtil', ['seaScheduledTasksHelper', 'SeaRequest',
        function (seaScheduledTasksHelper, SeaRequest) {


            return {
              
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaSearch', ['SeaRequest',
        function seaSearch(SeaRequest) {
            var request = new SeaRequest('search/{sub}');

            function actionlog(params) {
                params = params || {};
                params.sub = 'actionlog';

                return request.post(params);
            }

            return {
                /**
                 * search through actionlog
                 * @param {Object} params
                 * @config {Object} [query]
                 * @config {Number} [limit]
                 * @config {Number} [start]
                 */
                actionlog: function (params) {
                    return actionlog(params);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaTagHelper', ['seaConfig',
        function (seaConfig) {
            function getUrl(path) {
                return [seaConfig.getMicroServiceUrl(), seaConfig.getMicroServiceApiVersion(), 'tag', path].join('/');
            }

            return {
                getUrl: getUrl
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaTag', ['SeaRequest', 'seaTagHelper',
        function (SeaRequest, seaTagHelper) {
            var requestGroup = new SeaRequest(seaTagHelper.getUrl('group/{tagGroupId}'));
            var requestCustomerGroup = new SeaRequest(seaTagHelper.getUrl('group/customer/{customerId}'));
            var requestExplain = new SeaRequest(seaTagHelper.getUrl('group/{nodeType}/{nodeId}'));

            function createTagGroup(params) {
                return requestGroup.post(params);
            }

            function deleteTagGroup(tagGroupId) {
                return requestGroup.del({
                    tagGroupId: tagGroupId,
                });
            }

            function updateTagGroup(params) {
                return requestGroup.put(params);
            }

            function getTagGroupById(tagGroupId) {
                return requestGroup.get({
                    tagGroupId: tagGroupId,
                });
            }

            function getTagGroupByCustomerId(customerId, params) {
                params = params || {};
                return requestCustomerGroup.get(angular.extend({}, {
                    customerId: customerId,
                }, params));
            }

            function explain(nodeId, nodeType) {
                return requestExplain.get({
                    nodeId: nodeId,
                    nodeType: nodeType,
                });
            }

            return {
                group: {
                    create: function (params) {
                        return createTagGroup(params);
                    },
                    destroy: function (tagGroupId) {
                        return deleteTagGroup(tagGroupId);
                    },
                    update: function (params) {
                        return updateTagGroup(params);
                    },
                    get: function (tagGroupId) {
                        return getTagGroupById(tagGroupId);
                    },
                    listByCustomerId: function (customerId, params) {
                        return getTagGroupByCustomerId(customerId, params);
                    },
                },
                util: {
                    container: {
                        explain: function (containerId) {
                            return explain(containerId, 'container');
                        },
                    },
                    agent: {
                        explain: function (agentId) {
                            return explain(agentId, 'agent');
                        },
                    },
                },
            };
        }]);
})();
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
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaUserLocation', ['SeaRequest',
        function seaUserLocation(SeaRequest) {
            var request = new SeaRequest('user/{uId}/location');

            function get(uId) {
                return request.get({
                    uId: uId
                });
            }
            function update(params) {
                return request.post(params);
            }

            return {
                /**
                 * get location
                 * @param {String} uId
                 */
                get: function (cId) {
                    return get(cId);
                },

                /**
                 * update location
                 * @param {Object} params
                 * @config {String} [uId]
                 * @config {Object} [geo]
                 * @config {Number} [geo.lat]
                 * @config {Number} [geo.lon]
                 * @config {Object} [geo.address]
                 * @config {String} [geo.address.country]
                 * @config {String} [geo.address.state]
                 * @config {String} [geo.address.postcode]
                 * @config {String} [geo.address.city]
                 * @config {String} [geo.address.road]
                 * @config {String} [geo.address.house_number]
                 */
                update: function (params) {
                    return update(params);
                }
            };
        }]);
})();
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
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaUser', ['SeaRequest', 'seaUserGroup', 'seaUserLocation', 'seaUserSetting', 'seaUserSubstitude',
        function seaUser(SeaRequest, seaUserGroup, seaUserLocation, seaUserSetting, seaUserSubstitude) {
            var request = new SeaRequest('user/{uId}'),
                requestUser = new SeaRequest('user/{uId}/{sub}'),
                requestCustomer = new SeaRequest('user/{uId}/customer'),
                requestUsers = new SeaRequest('user');

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

            function listCustomers(uId) {
                return requestCustomer.get({
                    uId: uId
                });
            }

            function listUsers(cId, includeLocation) {
                return requestUsers.get({
                    customerId: cId,
                    includeLocation: includeLocation
                });
            }

            function deactivateTwoFactor(uId, password) {
                return requestUser.del({
                    uId: uId,
                    password: password,
                    sub: 'twofactor'
                });
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
                
                list: function(cId, includeLocation) {
                    return listUsers(cId, includeLocation);
                },
                
                group: seaUserGroup,
                location: seaUserLocation,
                setting: seaUserSetting,
                substitude: seaUserSubstitude,
                customer: {
                    list: function (uId) {
                        return listCustomers(uId);
                    }
                },
                twofactor: {
                    /**
                     * deactivate two-factor
                     * @param   {String}   uId
                     * @param   {String}   password
                     */
                    deactivate: function (uId, password) {
                        return deactivateTwoFactor(uId, password);
                    }
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaVaultEntry', ['SeaRequest', 'seaVaultHelper',
        function (SeaRequest, seaVaultHelper) {
            var request = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/entry'));
            var requestEntry = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/entry/{eId}'));
            var requestAction = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/entry/{eId}/{action}'));
            var requestEntries = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/entries'));
            var requestAgentSetting = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/entry/{eId}/agent/{aId}/setting/{key}'));

            function listEntries(vId) {
                return requestEntries.get({
                    vId: vId,
                });
            }

            function create(params) {
                return request.post(params);
            }

            function get(vId, eId) {
                return requestEntry.get(vId, eId);
            }

            function update(params) {
                return requestEntry.put(params);
            }

            function destroy(vId, eId) {
                return requestEntry.del({ vId, eId });
            }

            function unlock(params) {
                params = angular.extend({}, params, { action: 'unlock' });
                return requestAction.put(params);
            }

            function updateAgentSetting(params) {
                return requestAgentSetting.put(params);
            }


            return {
                list: function (vId) {
                    return listEntries(vId);
                },

                /**
                 * create entry
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} name
                 * @config {String} description
                 * @config {String} [password]
                 * @config {String} [privateKey]
                 * @config {Object} credentials 
                 */
                create: function (params) {
                    return create(params);
                },
                get: function (vId, eId) {
                    return get(vId, eId);
                },

                /**
                 * update entry
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} eId
                 * @config {String} name
                 * @config {String} description
                 * @config {String} [password]
                 * @config {String} [privateKey]
                 * @config {Object} credentials 
                 */
                update: function (params) {
                    return update(params);
                },
                destroy: function (vId, eId) {
                    return destroy(vId, eId);
                },
                /**
                * unlock vault
                * @param {Object} params
                * @config {String} vId
                * @config {String} [password]
                * @config {String} [privateKey]
                */
                unlock: function (params) {
                    return unlock(params);
                },
                agent: {
                    setting: {
                        /**
                        * update agent settings with vault entries
                        * @param {Object} params
                        * @config {String} vId   vaultId
                        * @config {String} eId   entryId
                        * @config {String} aId   agentId
                        * @config {String} key   agent setting key
                        * @config {String} [password]
                        * @config {String} [privateKey]
                        */

                        update: function (params) {
                            return updateAgentSetting(params);
                        }
                    }
                },
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaVaultHelper', ['seaConfig',
    function (seaConfig) {        
            function getUrl(path) {
                return [seaConfig.getMicroServiceUrl(), seaConfig.getMicroServiceApiVersion(), path].join('/');
            }

            return {
                getUrl: getUrl
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaVaultUser', ['SeaRequest', 'seaVaultHelper',
        function (SeaRequest, seaVaultHelper) {
            var request = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/user/{uId}'));

            function create(params) {
                return request.post(params);
            }

            function update(params) {
                return request.put(params);
            }

            function destroy(vId, uId) {
                return request.del({
                    vId: vId,
                    uId: uId,
                });
            }

            return {
                /**
                 * grant user access to a vault
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} uId
                 * @config {String} password
                 * @config {'ADMIN' | 'EDITOR' | 'READER'} role
                 */
                create: function (params) {
                    return create(params);
                },

                /**
                 * update user
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} uId
                 * @config {String} password
                 * @config {'ADMIN' | 'EDITOR' | 'READER'} role
                 */
                update: function (params) {
                    return update(params);
                },

                destroy: function (vId, uId) {
                    return destroy(vId, uId);
                },
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaVaultUtil', ['SeaRequest', 'seaVaultHelper',
        function (SeaRequest, seaVaultHelper) {

            var agentsRequest = new SeaRequest(seaVaultHelper.getUrl('vault/{vaultId}/entry/{entryId}/key/{credentialKey}/agent/'));
            var settingRequest = new SeaRequest(seaVaultHelper.getUrl('vault/{vaultId}/entry/{entryId}/agent/{agentId}/setting/{credentialKey}'));

            function listAgents(vId, eId, key) {
                return agentsRequest.get({
                    vaultId: vId,
                    entryId: eId,
                    credentialKey: key,
                });
            }

            function updateSettings(params) {
                return settingRequest.put({
                    vaultId: params.vId,
                    entryId: params.eId,
                    agentId: params.aId,
                    credentialKey: params.key,
                });
            }

            return {
                listAgents: function (vId, eId, key) {
                    return listAgents(vId, eId, key);
                },
                /**
                * update agent settings with vault entries
                * @param {Object} params
                * @config {String} vId   vaultId
                * @config {String} eId   entryId
                * @config {String} aId   agentId
                * @config {String} key   agent setting key
                * @config {String} [password]
                * @config {String} [privateKey]
                * @config {String} [token]
                */
                updateSettings: function (params) {
                    return updateSettings(params);
                },

            }
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaVault', ['SeaRequest', 'seaVaultHelper', 'seaVaultEntry', 'seaVaultUser', 'seaVaultUtil',
        function (SeaRequest, seaVaultHelper, seaVaultEntry, seaVaultUser, seaVaultUtil) {
            var requestVault = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}'));
            var requestAction = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/{action}'));
            var requestVaults = new SeaRequest(seaVaultHelper.getUrl('vault'));

            function listVaults(queryParams) {
                return requestVaults.get(queryParams);
            }

            function create(params) {
                return requestVaults.post(params);
            }
            
            function update(params) {
                return requestVault.put(params);
            }

            function get(vId) {
                return requestVault.get({
                    vId: vId,
                });
            }

            function destroy(vId) {
                return requestVault.del({
                    vId: vId
                });
            }
            
            function restore(params) {
                params = angular.extend({}, params, {action: 'restore'});
                return requestAction.post(params);
            }
           
            function unlock(params) {
                params = angular.extend({}, params, {action: 'unlock'});
                return requestAction.put(params);
            }

            return {
                list: function (queryParams) {
                    return listVaults(queryParams);
                },

                /**
                 * create vault
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String} [distributorId]
                 * @config {String} [userId]
                 * @config {Boolean} showPassword
                 * @config {String} authenticationMethod
                 * @config {String} name
                 * @config {String} description
                 * @config {String} password
                 */
                create: function (params) {
                    return create(params);
                },

                get: function (vId) {
                    return get(vId);
                },
                
                /**
                 * update vault
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} [customerId]
                 * @config {String} [distributorId]
                 * @config {String} [userId]
                 * @config {Boolean} [showPassword]
                 * @config {String} [authenticationMethod]
                 * @config {String} [name]
                 * @config {String} [description]
                 * @config {String} password
                 */
                update: function (params) {
                    return update(params);
                },

                destroy: function (vId) {
                    return destroy(vId);
                },
                
                /**
                 * restore vault
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} restoreKey
                 */
                restore: function (params) {
                    return restore(params);
                },
                
                /**
                 * unlock vault
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} [password]
                 * @config {String} [privateKey]
                 */
                unlock: function (params) {
                    return unlock(params);
                },
                entry: seaVaultEntry,
                user: seaVaultUser,
                util: seaVaultUtil,
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatchHistory', ['$http', 'SeaRequest', 'seaRemotingIasHelper',
        function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest(helper.getUrl('seias/rest/seocc/patch/1.0/container/history/{action}'));

            function format(container) {
                if (!container.JobList) {
                    return container;
                }

                container.JobList.forEach(function (job) {
                    ['StartTime', 'EndTime', 'PlannedStartTime'].forEach(function (key) {
                        if (job[key]) {
                            job[key] = new Date(job[key]);
                        }
                    });
                });

                return container;
            }

            function get(customerId, cId, params) {
                return list(customerId, [cId], params).then(function (history) {
                    return (history[0] || {}).JobList;
                });
            }

            function list(customerId, containerIds, params) {
                var query = helper.getContainerIds(containerIds);
                query.action = 'get';

                params = params || {};

                if (params.index != null) {
                    query.Index = params.index;
                }

                if (params.count != null) {
                    query.Count = params.count;
                }

                if (params.from != null) {
                    query.From = params.from;
                }

                if (params.states != null) {
                    query.States = params.states;
                }

                return request.post(query).then(function (containers) {
                    containers.forEach(format);
                    return containers;
                });
            }

            return {
                get: function (customerId, cId, params) {
                    return get(customerId, cId, params);
                },

                list: function (customerId, containerIds, params) {
                    return list(customerId, containerIds, params);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatchInstall', ['$http', 'SeaRequest', 'seaRemotingIasHelper',
        function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest(helper.getUrl('seias/rest/seocc/patch/1.0/container/install/{action}'));

            function format(container) {
                if (!container.JobList) {
                    return container;
                }

                container.JobList.forEach(function (job) {
                    ['StartTime', 'EndTime', 'PlannedStartTime'].forEach(function (key) {
                        if (job[key]) {
                            job[key] = new Date(job[key]);
                        }
                    });
                });

                return container;
            }

            function get(customerId, cId) {
                return list(customerId, [cId]).then(function (install) {
                    return install[0];
                });
            }

            function list(customerId, containerIds, params) {
                var query;
                params = params || {};

                if (params.jobIds) {
                    query = helper.getJobIds(params.jobIds);
                    query.action = 'software';
                } else {
                    query = helper.getContainerIds(containerIds);
                    query.action = 'get';
                }

                return request.post(query).then(function (containers) {
                    containers.forEach(format);
                    return containers;
                });
            }

            function create(params) {
                var customerId = params.customerId,
                    userId = params.userId,
                    containerId = params.containerId,
                    categories = params.categories,
                    software = params.softwareId,
                    cron = params.cron,
                    updateManualRelease = params.updateManualRelease,
                    postInstall = params.postInstall;

                var reqParams = {
                    Cron: cron,
                    UserId: userId
                };

                reqParams = angular.extend(reqParams, helper.getContainerIds(containerId));

                if (categories) {
                    reqParams.CategoryList = categories;
                }
                if (software) {
                    reqParams = angular.extend(reqParams, helper.getSoftwareIds(software));
                }
                if (updateManualRelease != null) {
                    reqParams.InstallManualReleaseSW = updateManualRelease;
                }
                if (postInstall == null) {
                    postInstall = 'NOTHING';
                }

                reqParams.PostAction = postInstall;

                return request.post(reqParams).then(helper.idListResult);
            }

            function destroy(customerId, jobId) {
                var query = helper.getJobIds(jobId);

                return request.del(query).then(helper.idListResult);
            }

            function getSoftware(customerId, jobId) {
                return listSoftware(customerId, [jobId]).then(function (install) {
                    return (install[0] || {});
                });
            }

            function listSoftware(customerId, jobIds) {
                var query = helper.getJobIds(jobIds);
                query.action = 'software';

                return request.post(query).then(function (containers) {
                    containers.forEach(format);
                    return containers;
                });
            }

            return {
                get: function (customerId, cId) {
                    return get(customerId, cId);
                },

                list: function (customerId, containerIds, params) {
                    return list(customerId, containerIds, params);
                },

                /**
                 * create scan job
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String|Array} [containerId]
                 * @config {String|Array} [softwareId]
                 * @config {Array} [categories]
                 * @config {String} [cron]
                 */
                create: function (params) {
                    return create(params);
                },

                destroy: function (customerId, jobId) {
                    return destroy(customerId, jobId);
                },

                getSoftware: function (customerId, jobId) {
                    return getSoftware(customerId, jobId);
                },

                listSoftware: function (customerId, jobIds) {
                    return listSoftware(customerId, jobIds);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatchReboot', ['$http', 'SeaRequest', 'seaRemotingIasHelper',
    function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest(helper.getUrl('seias/rest/seocc/patch/1.0/container/reboot'));

            function create(params) {
                var customerId = params.customerId,
                    userId = params.userId,
                    containerId = params.containerId,
                    cron = params.cron,
                    action = params.action;

                var reqParams = {
                    Cron: cron,
                    Action: action,
                    UserId: userId
                };

                reqParams = angular.extend(reqParams, helper.getContainerIds(containerId));

                return request.post(reqParams).then(helper.idListResult);
            }

            function destroy(customerId, jobId) {
                var query = helper.getJobIds(jobId);

                return request.del(query).then(helper.idListResult);
            }

            return {
                /**
                 * create reboot job
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String|Array} [containerId]
                 * @config {String} [action]
                 * @config {String} [cron]
                 */
                create: function (params) {
                    return create(params);
                },

                destroy: function (customerId, jobId) {
                    return destroy(customerId, jobId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatchScan', ['$http', 'SeaRequest', 'seaRemotingIasHelper',
    function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest(helper.getUrl('seias/rest/seocc/patch/1.0/container/scan/{action}'));
        
            function format(container) {
                if(!container.JobList) {
                    return container;
                }
                
                container.JobList.forEach(function (job) {
                    ['StartTime', 'EndTime'].forEach(function (key) {
                        if(job[key]) {
                            job[key] = new Date(job[key]);
                        }
                    });
                });
                
                return container;
            }
                
            function get(customerId, cId) {
                return list(customerId, [cId]).then(function (scan) {
                    return scan[0];
                });
            }

            function list(customerId, containerIds) {
                var query = helper.getContainerIds(containerIds);
                query.action = 'get';
                
                return request.post(query).then(function (containers) {
                    containers.forEach(format);
                    return containers;
                });
            }
        
            function create(params) {
                var query = helper.getContainerIds(params.containerIds);
                query.Cron = params.cron;
                
                return request.post(query).then(helper.idListResult);
            }

            return {
                get: function (customerId, cId) {
                    return get(customerId, cId);
                },

                list: function (customerId, containerIds) {
                    return list(customerId, containerIds);
                },
                
                /**
                 * create scan job
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String|Array} [containerIds]
                 * @config {String} [cron]
                 */
                create: function (params) {
                    return create(params);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatchSoftware', ['$http', 'SeaRequest', 'seaRemotingIasHelper',
    function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest(helper.getUrl('seias/rest/seocc/patch/1.0/container/software/{action}')),
                requestSoftware = new SeaRequest(helper.getUrl('seias/rest/seocc/patch/1.0/software/{method}/{action}'));

            function get(customerId, softwareId) {
                var query = helper.getSoftwareIds(softwareId);
                query.method = 'get';

                return requestSoftware.post(query).then(function (result) { return result[0]; });
            }
        
            function getByContainer(customerId, cId, params) {
                return listByContainer(customerId, [cId], params).then(function (software) {
                    return software[0];
                });
            }

            function listByContainer(customerId, containerIds, params) {
                var query = helper.getContainerIds(containerIds);
                query.action = 'get';

                params = params || {};

                if (params.installed == null) {
                    query.Installed = 'BOTH';
                } else {
                    query.Installed = params.installed ? 'TRUE' : 'FALSE';
                }

                if (params.blocked == null) {
                    query.Blocked = 'BOTH';
                } else {
                    query.Blocked = params.blocked ? 'TRUE' : 'FALSE';
                }

                return request.post(query);
            }

            function has(customerId, containerIds, softwareIds, params) {
                var query = helper.getContainerIds(containerIds);
                query.SoftwareIdList = helper.getSoftwareIds(softwareIds).SoftwareIdList;
                query.method = 'container';

                params = params || {};

                if (params.installed == null) {
                    query.Installed = 'BOTH';
                } else {
                    query.Installed = params.installed ? 'TRUE' : 'FALSE';
                }

                return requestSoftware.post(query);
            }

            function block(customerId, containerIds, softwareIds, isBlocked) {
                var query = angular.extend(
                    helper.getContainerIds(containerIds),
                    helper.getSoftwareIds(softwareIds)
                );
                query.action = 'block';
                query.Blocked = isBlocked;

                return request.post(query).then(helper.idListResult);
            }

            return {
                container: {
                    /**
                     * list software of container
                     * @param {String} customerId
                     * @param {String} containerId
                     * @param {Object} params
                     * @config {Boolean} [installed]
                     * @config {Boolean} [blocked]
                     */
                    get: function (customerId, containerId, params) {
                        return getByContainer(customerId, containerId, params);
                    },

                    list: function (customerId, containerIds, params) {
                        return listByContainer(customerId, containerIds, params);
                    }
                },

                get: function(customerId, softwareId) {
                    return get(customerId, softwareId);
                },
                
                /**
                 * find out if a container has a specific software installed
                 * @param {String} customerId
                 * @param {String} containerId
                 * @param {String} softwareId
                 * @param {Object} params
                 * @config {Boolean} [installed]
                 */
                has: function (customerId, containerId, softwareId, params) {
                    return has(customerId, containerId, softwareId, params);
                },

                /**
                 * block software on containers
                 * @param   {String}   customerId   
                 * @param   {String|Array}   containerIds 
                 * @param   {String|Array}   softwareIds  
                 * @param   {Boolean}  isBlocked
                 */
                block: function (customerId, containerIds, softwareIds, isBlocked) {
                    return block(customerId, containerIds, softwareIds, isBlocked);
                }
            };
    }]);
})();
//# sourceMappingURL=maps/ng-se-api.js.map