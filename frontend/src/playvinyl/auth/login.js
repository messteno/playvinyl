'use strict';

/**
 * @ngInject
 */
var app = angular.module('playvinyl');
app.controller('LoginCtrl', function($scope, $modalInstance, $location, djangoAuth, Validate) {
    $scope.model = {'username':'','password':''};
    $scope.complete = false;
    $scope.login = function(formData) {
        $scope.errors = [];
        Validate.formValidation(formData,$scope.errors);
        if (!formData.$invalid) {
            djangoAuth.login($scope.model.username, $scope.model.password)
                .then(function() {
                    // success case
                    $location.path('/');
                    $location.hash('');
                    $modalInstance.close();
                }, function(data) {
                    // error case
                    $scope.errors = data;
                });
        }
    };
});
