'use strict';

var app = angular.module('playvinyl');
app.controller('ResetPasswordCtrl', function ($scope, $modalInstance, djangoAuth, Validate) {
    $scope.model = {'email':''};
    $scope.complete = false;
    $scope.resetPassword = function(formData){
        $scope.errors = [];
        Validate.formValidation(formData, $scope.errors);
        if (!formData.$invalid) {
            djangoAuth.resetPassword($scope.model.email)
                .then(function() {
                    $scope.complete = true;
                },function(data){
                    $scope.errors = data;
                });
        }
    };
});
