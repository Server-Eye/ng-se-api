(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingIasHelper', [ '$q',
    function seaRemotingPcvisit($q) {
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

            return {
                getContainerIds: getContainerIds,
                getSoftwareIds: getSoftwareIds,
                getJobIds: getJobIds,
                getEventIds: getEventIds,
                idListResult: idListResult
            };
    }]);
})();