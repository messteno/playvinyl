'use strict';

/**
 * @ngInject
 */
var app = angular.module('playvinyl');
app.controller('RegisterCtrl', function ($scope, $location, $uibModalInstance, djangoAuth, Validate) {
    $scope.model = {'username': '', 'password1': '', 'password2': '', 'email': ''};
    $scope.register = function(formData){
        $scope.errors = [];
        Validate.formValidation(formData, $scope.errors);
        if (!formData.$invalid) {
            djangoAuth.register($scope.model.username,
                                $scope.model.password1,
                                $scope.model.password2,
                                $scope.model.email)
                .then(function(){
                    $uibModalInstance.close();
                }, function(data){
                    $scope.errors = data;
                });
        }
    };
});
