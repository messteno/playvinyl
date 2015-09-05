'use strict';

/**
 * @ngInject
 */
function Routes($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false,
    });
    $locationProvider.hashPrefix('!');
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/static/html/main/main.html',
            title: 'Home',
            controller: 'MainCtrl',
        })
        .state('reset-password', {
            url: '/reset-password/{uid}/{token}',
            template: '',
            controller: 'ResetPasswordConfirmCtrl',
        })
        .state('about', {
            url: '/about',
            templateUrl: '/static/html/main/about.html',
        })
        .state('payment', {
            url: '/payment',
            templateUrl: '/static/html/main/payment.html',
        })
        .state('shipping', {
            url: '/shipping',
            templateUrl: '/static/html/main/shipping.html',
        })
        .state('vinyl', {
            url: '/vinyl/{slug}',
            templateUrl: '/static/html/vinyl/item.html',
            controller: 'VinylItemController',
        })
        .state('vinyl-author', {
            url: '/author/{slug}',
            templateUrl: '/static/html/vinyl/list.html',
            controller: 'VinylAuthorController',
        })
        .state('vinyl-label', {
            url: '/label/{slug}',
            templateUrl: '/static/html/vinyl/list.html',
            controller: 'VinylLabelController',
        })
        .state('404', {
            url: '/404',
            template: '404 error',
        })
        ;
    $urlRouterProvider
        .when('', '/')
        .otherwise('404')
        ;
}

module.exports = Routes;
