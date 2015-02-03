'use strict';

require('angular');
require('angular-bootstrap');
require('angular-bootstrap-tpls');
require('angular-ui-router');
require('angular-route');
require('angular-cookies');

window.$ = window.jQuery = require('jquery');
require('owlcarousel');

var requires = [
    'ui.bootstrap',
    'ui.router',
    'ngRoute',
    'ngCookies',
];

var app = angular.module('playvinyl', requires);
app
.config(require('./routes'))
.run(function(djangoAuth){
    djangoAuth.initialize('/api/rest-auth', false);
});

require('./auth/auth');
require('./main/main');

/**
 * @ngInject
 */
app.controller('IndexCtrl', function($scope, $modal, $timeout, $location, djangoAuth) {
    $scope.authenticated = false;
    $scope.year = new Date().getFullYear();
    djangoAuth.authenticationStatus(true).then(function(){
        $scope.authenticated = true;
        $location.hash('');
    }, function() {
        var hashStrings = $location.hash().split('/');
        if (hashStrings.length > 2 && hashStrings[0] === 'reset-password') {
            var uid = hashStrings[1];
            var token = hashStrings[2];
            $scope.resetPasswordConfirm(uid, token);
        } else {
            $location.hash('');
        }
    });
    $scope.$on('djangoAuth.logged_out', function() {
        $scope.authenticated = false;
    });
    $scope.$on('djangoAuth.logged_in', function() {
        $scope.authenticated = true;
    });
    $scope.logout = function() {
        djangoAuth.logout().then(handleSuccess, handleError);
    };
    $scope.login = function() {
        var modalInstance = $modal.open({
            templateUrl: '/static/app/auth/login.html',
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
            templateUrl: '/static/app/auth/register.html',
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
            templateUrl: '/static/app/auth/resetPassword.html',
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
            templateUrl: '/static/app/auth/resetPasswordConfirm.html',
            controller: 'ResetPasswordConfirmCtrl',
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
});
