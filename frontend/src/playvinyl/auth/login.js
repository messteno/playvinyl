'use strict';

/**
 * @ngInject
 */
var app = angular.module('playvinyl');
app.controller('LoginCtrl', function($scope, $uibModalInstance, $location, djangoAuth, Validate) {
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
                    $uibModalInstance.close();
                }, function(data) {
                    // error case
                    $scope.errors = data;
                });
        }
    };
});
