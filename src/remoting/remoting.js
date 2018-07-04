(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemoting', ['SeaRequest', 'seaRemotingPcvisit', 'seaRemotingNetwork', 'seaRemotingAntivirus', 'seaRemotingPatch', 'seaRemotingPowershell',
    function seaRemoting(SeaRequest, seaRemotingPcvisit, seaRemotingNetwork, seaRemotingAntivirus, seaRemotingPatch, seaRemotingPowershell) {
            return {
                antivirus: seaRemotingAntivirus,
                pcvisit: seaRemotingPcvisit,
                powershell: seaRemotingPowershell,
                network: seaRemotingNetwork,
                patch: seaRemotingPatch
            };
    }]);
})();