(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatch', ['SeaRequest', 'seaPatchContainer', 'seaPatchViewFilter', 'seaPatchHelper',
        function seaUser(SeaRequest, seaPatchContainer, seaPatchViewFilter, seaPatchHelper) {
            var request = new SeaRequest(seaPatchHelper.getUrl('patch/customers'));

            function listCustomers() {
                return request.get();
            }            
            
            return {
                customer: {
                    list: listCustomers
                },
                container: seaPatchContainer,
                viewFilter: seaPatchViewFilter,
            };
        }]);
})();