angular.module('hci')
    .controller('ProfileController', function ($scope, $cookies, $state) {
        $scope.userID = $cookies.get("userID");
    });