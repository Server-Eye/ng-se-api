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
            SeaRequest.prototype.formatUrl = function formatUrl(params, url) {
                url = seaConfig.getUrl(url || this.urlPath)
                params = params ? angular.copy(params) : {};

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
                var deferred = $q.defer(),
                    conf = {
                        method: method
                    };

                conf.url = this.formatUrl(params, urlPath);

                if (method === 'POST' || method === 'PUT') {
                    conf.data = params || {};
                } else {
                    conf.params = params || {};
                }

                $http(conf).then(function (resp) {
                    var total = resp.headers('x-total-count');
                    
                    if(total != null) {
                        resp.data.totalCount = total;
                    }
                    
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