angular.module('hci')
  .controller('HomeController', function ($rootScope, $scope, $timeout, $q, $localStorage, $mdDialog, $cookies, $window, ApiCourse) {

    var self = $scope;
    var apiCourse = new ApiCourse();

    $scope.userID = $cookies.get("userID");
    $scope.storage = $localStorage;
    $scope.storage[$scope.userID] = $localStorage[$scope.userID] || {};
    $scope.isAudit = false;
    self.simulateQuery = false;
    self.isDisabled = false;
    self.states = loadAll();
    self.querySearch = querySearch;
    self.selectedCourseID = "";
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;
    self.loading = false;
    
    self.enrolledCourses = $scope.storage[$scope.userID].enrolled || [];
    self.totalCredit = $scope.storage[$scope.userID].credit || 0;

    function querySearch(query) {
      var results = query ? self.states.filter(createFilterFor(query)) : self.states,
        deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function searchTextChange(text) {
      $scope.loading = false;
    }

    function selectedItemChange(item) {
      if (!!!item) { $scope.loading = false; return; }

      $scope.loading = true;
      $scope.selectedCourseID = item.value;
      apiCourse.getInfo($scope.selectedCourseID).then(function (resp) {
        $scope.courses = resp.data;
        $scope.loading = false;
      }, function (resp) {
        $scope.courses = [];
        $scope.loading = false;
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title("Mistake")
            .textContent("Sorry, can not find this course's data.")
            .ok('Ok')
        );
      });
    }

    function loadAll() {
      return Object.keys(courses).map(function (key) {
        return {
          value: key,
          display: key + ": " + courses[key].name["en"]
        };
      });
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    };

    self.enroll = function (sec) {
      var isEnrolled = false;
      $scope.enrolledCourses.forEach(function (enroll) {
        if (enroll.id == $scope.selectedCourseID) {
          isEnrolled = true;
        }
      });
      if (isEnrolled) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title("Mistake")
            .textContent("Sorry, you may already enroll this course.")
            .ok('Ok')
        );
        return;
      }
      $scope.enrolledCourses.unshift({
        id: $scope.selectedCourseID,
        name: courses[$scope.selectedCourseID].name.en,
        sec: sec,
        credit: !$scope.isAudit
      });
      if (!$scope.isAudit) {
        self.totalCredit += courses[$scope.selectedCourseID].credit.total;
      }
      $scope.isAudit = false;
      $scope.storage[$scope.userID].enrolled = $scope.enrolledCourses;
      $scope.storage[$scope.userID].credit = self.totalCredit;
    };

    self.drop = function (index, id) {
      $scope.enrolledCourses.splice(index, 1);

      self.totalCredit -= courses[id].credit.total;
      self.totalCredit = self.totalCredit <=0 ? 0 : self.totalCredit;

      $scope.storage[$scope.userID].enrolled = $scope.enrolledCourses;
      $scope.storage[$scope.userID].credit = self.totalCredit;
    };
  });
