(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemoting', ['SeaRequest', 'seaRemotingPcvisit', 'seaRemotingNetwork', 'seaRemotingAntivirus', 'seaRemotingPatch', 'seaRemotingPowershell',
        function seaRemoting(SeaRequest, seaRemotingPcvisit, seaRemotingNetwork, seaRemotingAntivirus, seaRemotingPatch, seaRemotingPowershell) {
            var shutdownRequest = new SeaRequest('shutdown/{customerId}/{containerId}');

            function shutdown(customerId, containerId, credentials, force, reboot) {
                return shutdownRequest.post({
                    customerId: customerId,
                    containerId: containerId,
                    force: force,
                    reboot: reboot,
                    user: credentials.user,
                    password: credentials.password,
                    domain: credentials.domain,
                });
            }

            return {
                antivirus: seaRemotingAntivirus,
                pcvisit: seaRemotingPcvisit,
                powershell: seaRemotingPowershell,
                network: seaRemotingNetwork,
                patch: seaRemotingPatch,
                shutdown: function (customerId, containerId, credentials, force, reboot) {
                    return shutdown(customerId, containerId, credentials, force, reboot);
                }
            };
        }]);
})();