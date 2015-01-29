"use strict";

angular.module('se').controller('AgentTestController', ['$scope', 'sesAgent', function($scope, sesAgent) {
    sesAgent.get('69583931-cc47-11e2-820c-09588dabea53').then(function(agent) {
        $scope.agent = agent;
    });
    
    sesAgent.note.list('69583931-cc47-11e2-820c-09588dabea53').then(function(result) {
        console.log('notes', result);
    });
    
    sesAgent.actionlog.list('69583931-cc47-11e2-820c-09588dabea53').then(function(result) {
        console.log('actionlog', result);
    });
    
    sesAgent.chart.get('69583931-cc47-11e2-820c-09588dabea53').then(function(result) {
        console.log('chart', result);
    });
    
    sesAgent.notification.list('69583931-cc47-11e2-820c-09588dabea53').then(function(result) {
        console.log('notification', result);
    });
    
    sesAgent.setting.list('69583931-cc47-11e2-820c-09588dabea53').then(function(result) {
        console.log('setting', result);
    });
}]);