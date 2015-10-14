(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemoting', ['SeaRequest', 'seaRemotingPcvisit', 'seaRemotingNetwork', 'seaRemotingPatch',
    function seaRemoting(SeaRequest, seaRemotingPcvisit, seaRemotingNetwork, seaRemotingPatch) {
            return {
                pcvisit: seaRemotingPcvisit,
                network: seaRemotingNetwork,
                patch: seaRemotingPatch
            };
    }]);
})();