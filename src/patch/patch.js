(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatch', ['SeaRequest', 'seaPatchContainer', 'seaPatchViewFilter', 'seaPatchHelper',
        function seaUser(SeaRequest, seaPatchContainer, seaPatchViewFilter, seaPatchHelper) {
            var request = new SeaRequest(seaPatchHelper.getUrl('patch/customers')),
            requestCategories = new SeaRequest(seaPatchHelper.getUrl('patch/categories'));

            function listCustomers() {
                return request.get();
            }     

            function listCategories() {
                return requestCategories.get();
            }            
            
            return {
                customer: {
                    list: listCustomers
                },
                category: {
                    list: listCategories,
                },
                container: seaPatchContainer,
                viewFilter: seaPatchViewFilter,
            };
        }]);
})();