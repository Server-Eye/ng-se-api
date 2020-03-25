(function () {
    "use strict";

    angular.module('ngSeApi').factory('SeaRequest', ['seaConfig', '$q', '$http', 'SeaRequestHelperService',
        function SeaRequest(seaConfig, $q, $http, SeaRequestHelperService) {
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

                $http(conf).then(function (resp) {
                    var total = resp.headers('x-total-count');

                    if (total != null) {
                        resp.data.totalCount = total;
                    }

                    deferred.resolve(resp.data);
                }, function (err) {
                    SeaRequestHelperService.dumpResponse(err);
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