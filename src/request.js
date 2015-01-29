"use strict";

angular.module('seApi').factory('SesRequest', ['sesApiConfig', '$q', '$http',
  function sesRequest(sesApiConfig, $q, $http) {
        function SesRequest(urlPath) {
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
        SesRequest.prototype.formatUrl = function formatUrl(url, params) {
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

        SesRequest.prototype.send = function send(method, params, urlPath) {
            var fullUrl = sesApiConfig.getUrl(urlPath || this.urlPath),
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
        SesRequest.prototype.get = function get(params, urlPath) {
            return this.send('GET', params, urlPath);
        }
        
        /**
         * perform POST request
         * @param {Object}  params  The request parameters
         * @param {String}  urlPath only append if url is different to classes urlPath
         * @returns {Boolean} promise
         */
        SesRequest.prototype.post = function get(params, urlPath) {
            return this.send('POST', params, urlPath);
        }
        
        /**
         * perform PUT request
         * @param {Object}  params  The request parameters
         * @param {String}  urlPath only append if url is different to classes urlPath
         * @returns {Boolean} promise
         */
        SesRequest.prototype.put = function get(params, urlPath) {
            return this.send('PUT', params, urlPath);
        }
        
        /**
         * perform DELETE request
         * @param {Object}  params  The request parameters
         * @param {String}  urlPath only append if url is different to classes urlPath
         * @returns {Boolean} promise
         */
        SesRequest.prototype.del = function get(params, urlPath) {
            return this.send('DELETE', params, urlPath);
        }

        return SesRequest;
}]);