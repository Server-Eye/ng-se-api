(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemoting', ['SeaRequest', 'seaRemotingPcvisit', 'seaRemotingNetwork', 'seaRemotingAntivirus', 'seaRemotingPatch',
    function seaRemoting(SeaRequest, seaRemotingPcvisit, seaRemotingNetwork, seaRemotingAntivirus, seaRemotingPatch) {
            return {
                antivirus: seaRemotingAntivirus,
                pcvisit: seaRemotingPcvisit,
                network: seaRemotingNetwork,
                patch: seaRemotingPatch
            };
    }]);
})();