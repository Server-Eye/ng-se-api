(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingNetwork', ['SeaRequest',
    function seaRemotingNetwork(SeaRequest) {
            var request = new SeaRequest('network/{customerId}/{cId}/system/{action}');
            var requestMicroService = new SeaRequest('network/{customerId}/{cId}/system/{action}', 'v3');

            function format(job) {
                if (job && job.createdAt) {
                    job.createdAt = new Date(job.createdAt);
                }

                return job;
            }

            function list(params) {
                return request.get(params);
            }

            function install(params) {
                return requestMicroService.post(params);
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