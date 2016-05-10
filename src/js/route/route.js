angular.module('hci')
  .config(function ($stateProvider, $urlRouterProvider) {

    var $cookies;
    angular.injector(['ngCookies']).invoke(['$cookies', function (_$cookies_) {
      $cookies = _$cookies_;
    }]);

    $urlRouterProvider.otherwise("/login");

    $stateProvider
      .state('login', {
        url: "/login",
        templateUrl: "src/view/login.html",
        onEnter: function ($state) {
          if (!!$cookies.get("userID")) {
            $state.go('home');
          }
        },
      })
      .state('home', {
        url: "/home",
        templateUrl: "src/view/home.html",
        onEnter: function ($state) {
          if (!!!$cookies.get("userID")) {
            $state.go('login');
          }
        },
      })
      .state('profile', {
        url: "/profile",
        templateUrl: "src/view/profile.html",
        onEnter: function ($state) {
          if (!!!$cookies.get("userID")) {
            $state.go('login');
          }
        },
      });;
  });
