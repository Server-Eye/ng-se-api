(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaReporting', ['SeaRequest', 'seaReportingTemplate',
    function seaCustomer(SeaRequest, seaReportingTemplate) {
            var request = new SeaRequest('reporting/{cId}/report'),
                reportRequest = new SeaRequest('reporting/{cId}/report/{rId}');
            var requestMicroService = new SeaRequest('reporting/{cId}/report', 'v3'),
                reportRequestMicroService = new SeaRequest('reporting/{cId}/report/{rId}', 'v3');

            function formatReport(report) {
                ['startDate', 'lastDate', 'nextDate'].forEach(function (prop) {
                    if(report[prop]) {
                        report[prop] = new Date(report[prop]);
                    }
                });
                
                if(report.history) {
                    report.history.forEach(function (generated) {
                        generated.generatedDate = new Date(generated.generatedDate);
                    });
                }
                
                return report;
            }
        
            function create(params) {
                return requestMicroService.post(params);
            }
        
            function list(cId) {
                return request.get({
                    cId: cId
                }).then(function (reports) {
                    reports.forEach(formatReport);
                    return reports;
                });
            }
        
            function listTypes(cId) {
                return reportRequest.get({
                    cId: cId,
                    rId: 'type'
                });
            }

            function get(cId, rId) {
                return reportRequest.get({
                    cId: cId,
                    rId: rId
                }).then(function (report) {
                    return formatReport(report);
                });
            }
        
            function destroy(cId, rId) {
                return requestMicroService.del({
                    cId: cId,
                    rId: rId
                });
            }

            return {
                list: function (cId) {
                    return list(cId);
                },

                type: {
                    list: function (cId) {
                        return listTypes(cId);
                    }
                },
                
                report: {
                    get: function (cId, rId) {
                        return get(cId, rId);
                    },
                    
                    /**
                     * create report
                     * @param {Object} params
                     * @config {String} [cId]
                     * @config {String} [rtId]
                     * @config {String} [repeatCron]
                     * @config {String} [recipients]
                     */
                    create: function(params) {
                        return create(params);
                    },
                    
                    destroy: function (cId, rId) {
                        return destroy(cId, rId);
                    }
                },

                template: seaReportingTemplate
            };
    }]);
})();