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

                if(!reqConfig.headers) {
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