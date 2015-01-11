'use strict';

/**
 * @ngInject
 */
function Routes($stateProvider, $locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/static/app/main/main.html',
            title: 'Home',
        });
    $urlRouterProvider
        .when('', '/')
        .otherwise('/')
        ;
}

module.exports = Routes;
