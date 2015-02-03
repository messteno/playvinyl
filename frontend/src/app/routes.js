'use strict';

/**
 * @ngInject
 */
function Routes($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/static/app/main/main.html',
            title: 'Home',
            controller: 'MainCtrl',
        })
        .state('homeok', {
            url: '/ok',
            template: '/static/app/mai.sdas',
            title: 'Home',
        });
    $urlRouterProvider
        .when('', '/')
        .otherwise('/')
        ;
}

module.exports = Routes;
