angular.module('hci')
    .controller('LoginController', function ($scope, $cookies, $state) {
        
        $scope.login = function(){
            $cookies.put("userID", $scope.user.id);
            $state.go('home');
        }
    });