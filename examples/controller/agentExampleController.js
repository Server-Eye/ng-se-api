"use strict";

angular.module('se').controller('AgentExampleController', ['$scope', 'seaAgent', function($scope, seaAgent) {
    seaAgent.get('69583931-cc47-11e2-820c-09588dabea53').then(function(result) {
        console.log('agent', result);
    });

    seaAgent.note.list('69583931-cc47-11e2-820c-09588dabea53').then(function(result) {
        console.log('notes', result);
    });

    seaAgent.actionlog.list('69583931-cc47-11e2-820c-09588dabea53').then(function(result) {
        console.log('actionlog', result);
    });

    seaAgent.chart.get('69583931-cc47-11e2-820c-09588dabea53').then(function(result) {
        console.log('chart', result);
    });

    seaAgent.notification.list('69583931-cc47-11e2-820c-09588dabea53').then(function(result) {
        console.log('notification', result);
    });

    seaAgent.setting.list('69583931-cc47-11e2-820c-09588dabea53').then(function(result) {
        console.log('setting', result);
    });

    seaAgent.category.list().then(function(result) {
        console.log('categories', result);
    });

    seaAgent.type.list().then(function(result) {
        console.log('types', result);
    });

    seaAgent.type.setting.list('ceaec5d31c65e0ea011c65f58a78000e').then(function(result) {
        console.log('type settings', result);
    });
}]);
