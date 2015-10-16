(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatchHelper', [ '$q',
    function seaRemotingPcvisit($q) {
            function getContainerIds(containerIds) {
                if (!angular.isArray(containerIds)) {
                    containerIds = [containerIds];
                }

                var query = containerIds.map(function (containerId) {
                    return {
                        ContainerId: containerId
                    };
                });

                return {
                    ContainerIdList: query
                };
            }

            function getSoftwareIds(softwareIds) {
                if (!angular.isArray(softwareIds)) {
                    softwareIds = [softwareIds];
                }

                var query = softwareIds.map(function (softwareId) {
                    return {
                        SoftwareId: softwareId
                    };
                });

                return {
                    SoftwareIdList: query
                };
            }

            function getJobIds(jobIds) {
                if (!angular.isArray(jobIds)) {
                    jobIds = [jobIds];
                }

                var query = jobIds.map(function (jobId) {
                    return {
                        JobId: jobId
                    };
                });

                return {
                    JobIdList: query
                };
            }

            function idListResult(result) {
                if (result.Msg == 'success') {
                    return $q.resolve(result.IdList.map(function (entry) {
                        return entry.Id;
                    }));
                }

                return $q.reject(new Error(result.Msg));
            }

            return {
                getContainerIds: getContainerIds,
                getSoftwareIds: getSoftwareIds,
                getJobIds: getJobIds,
                idListResult: idListResult
            };
    }]);
})();