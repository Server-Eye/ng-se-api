"use strict";

angular.module('se').controller('AgentTestController', ['$scope', 'sesAgent', function($scope, sesAgent) {
    sesAgent.get('69583931-cc47-11e2-820c-09588dabea53').then(function(result) {
        console.log('agent', result);
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

    sesAgent.category.list().then(function(result) {
        console.log('categories', result);
    });

    sesAgent.type.list().then(function(result) {
        console.log('types', result);
    });

    sesAgent.type.setting.list('ceaec5d31c65e0ea011c65f58a78000e').then(function(result) {
        console.log('type settings', result);
    });
}]);