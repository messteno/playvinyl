'use strict';

require('angular');
require('angular-bootstrap');
require('angular-bootstrap-tpls');
require('angular-ui-router');
require('angular-route');
require('angular-cookies');
require('angular-seo');
require('angular-resource');
require('angular-soundmanager2');

window.$ = window.jQuery = require('jquery');
require('owlcarousel2');

var requires = [
    'ui.bootstrap',
    'ui.router',
    'ngRoute',
    'ngCookies',
    'ngResource',
    'ng',
    'seo',
    'angularSoundManager',
];

var app = angular.module('playvinyl', requires);
app
.config(require('./routes'))
.config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}])
.run(function($state, $rootScope, $modalStack, $modal, djangoAuth) {
    //var publicStates = ['home', 'reset-password', 'about', ];
    var authStates = [];
    var authenticationCheck = true;
    var recheckAuthOnPrivateRequest = true;

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        $modalStack.dismissAll();

        if (authStates.indexOf(toState.name) === -1) {
            return;
        }

        if (authenticationCheck === false) {
            authenticationCheck = recheckAuthOnPrivateRequest;
            return;
        }

        event.preventDefault();
        djangoAuth.getProfile(authenticationCheck).then(function(data) {
            var authenticated = data.is_authenticated || false;
            if (authenticated) {
                authenticationCheck = false;
                $state.go(toState.name, toParams);
            } else if (authStates.indexOf(toState.name) >= 0) {
                authenticationCheck = false;
                $state.go(toState.name, toParams);
            } else {
                $state.go('home');
                $rootScope.$broadcast('djangoAuth.need_login', {
                    redirect: toState.name
                });
            }
            return;
        });
    });
})
;

require('./auth/auth');
require('./player/player');
require('./vinyl/vinyl');
require('./main/main');
require('./request');

/**
 * @ngInject
 */
app.controller('IndexCtrl', function($scope, $state, $modal, $timeout, $location,
                                     djangoAuth, VinylAuthors, VinylLabels, VinylCatalogs) {
    $scope.authenticated = false;
    $scope.year = new Date().getFullYear();

    $scope.authenticated = false;
    $scope.isAdmin = false;
    $scope.profile = {};

    var updateProfile = function(data) {
        $scope.authenticated = data.is_authenticated || false;
        $scope.isAdmin = data.is_admin || false;
        $scope.profile = data;
    };

    djangoAuth.getProfile().then(updateProfile);

    $scope.$on('djangoAuth.logged_out', function() {
        $scope.authenticated = false;
        // force update profile
        djangoAuth.getProfile(true).then(updateProfile);
        $state.go('home');
    });
    $scope.$on('djangoAuth.logged_in', function() {
        $scope.authenticated = true;
    });
    $scope.$on('djangoAuth.need_login', function(event, loginParams) {
        $timeout(function() {
            $scope.login(loginParams.redirect);
        }, 0);
    });
    $scope.logout = function() {
        djangoAuth.logout().then(handleSuccess, handleError);
    };
    $scope.login = function() {
        var modalInstance = $modal.open({
            templateUrl: '/static/html/auth/login.html',
            controller: 'LoginCtrl',
            size: 'sm',
        });

        modalInstance.result.then(function (action) {
            if (action === 'register') {
                $timeout(function() {
                    $scope.register();
                }, 0);
            } else if (action === 'reset-pass') {
                $timeout(function() {
                    $scope.resetPassword();
                }, 0);
            }
        }, function () {
        });
    };
    $scope.register = function() {
        var modalInstance = $modal.open({
            templateUrl: '/static/html/auth/register.html',
            controller: 'RegisterCtrl',
            size: 'sm',
        });

        modalInstance.result.then(function (action) {
            if (action === 'login') {
                $timeout(function() {
                    $scope.login();
                }, 0);
            }
        }, function () {
        });
    };
    $scope.resetPassword = function() {
        var modalInstance = $modal.open({
            templateUrl: '/static/html/auth/resetPassword.html',
            controller: 'ResetPasswordCtrl',
            size: 'sm',
        });

        modalInstance.result.then(function (action) {
            if (action === 'login') {
                $timeout(function() {
                    $scope.login();
                }, 0);
            }
        }, function () {
        });
    };
    $scope.resetPasswordConfirm = function(uid, token) {
        var modalInstance = $modal.open({
            templateUrl: '/static/html/auth/resetPasswordConfirm.html',
            controller: 'ResetPasswordConfirmModalCtrl',
            size: 'sm',
            resolve: {
                'uid': function() {
                    return uid;
                },
                'token': function() {
                    return token;
                },
            },
        });

        modalInstance.result.then(function(action) {
            $location.hash('');
            if (action === 'login') {
                $timeout(function() {
                    $scope.login();
                }, 0);
            }
        }, function () {
            $location.hash('');
        });
    };
    var handleSuccess = function(data) {
        $scope.response = data;
    };
    var handleError = function(data) {
        $scope.response = data;
    };

    $scope.vinylAuthors = VinylAuthors.query();
    $scope.vinylLabels = VinylLabels.query();
    $scope.vinylCatalogs = VinylCatalogs.query();
    $scope.navMenu = {
        'isAuthorsCollapsed': true,
        'isLabelsCollapsed': true,
    };
});
