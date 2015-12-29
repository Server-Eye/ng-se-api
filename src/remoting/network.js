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
        
            function getInstallStatus(customerId, cId, version) {
                return request.get({
                    customerId: customerId,
                    cId: cId,
                    action: 'installstatus',
                    v: version
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

                    installStatus: function (customerId, cId, version) {
                        return getInstallStatus(customerId, cId, version);
                    }
                }
            };
    }]);
})();