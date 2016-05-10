angular.module('hci', ['ngMaterial', 'ui.router', 'ngStorage', 'ngMessages', 'ngCookies'])
  .controller('HciController', function ($rootScope, $scope, $cookies, $state, $mdDialog, $localStorage) {

    $scope.storage = $localStorage;
    $scope.paths = $rootScope.paths || [];
    
    $scope.logout = function () {
      $cookies.remove("userID");
      $state.go('login');
    };

    $scope.goto = function (state) {
      $state.go(state);
    };

    $scope.showConfirm = function (ev) {
      var confirm = $mdDialog
        .confirm()
        .title('Show enrollment json')
        .textContent('Whose enrollment you prefer?')
        .targetEvent(ev)
        .ok('Every enrollment')
        .cancel('Only my enrollment');
      $mdDialog.show(confirm).then(function () {
        showAllEnroll(ev)
      }, function () {
        showMyEnroll(ev);
      });
    };

    function showMyEnroll(ev) {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title($cookies.get("userID") || "Anonymous user" + "'s enrollment")
          .textContent(JSON.stringify($localStorage[$cookies.get("userID")], null, 2))
          .ariaLabel('Json Dialog')
          .ok('Done')
          .targetEvent(ev)
      );
    };
    function showAllEnroll(ev) {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title("Every enrollment")
          .textContent(JSON.stringify($localStorage, null, 2))
          .ariaLabel('Json Dialog')
          .ok('Done')
          .targetEvent(ev)
      );
    }
  })
