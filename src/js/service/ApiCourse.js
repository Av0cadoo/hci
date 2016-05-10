angular.module('hci')
    .factory('ApiCourse', function ($http) {
        return function () {
            this.getInfo = function (id) {
                return $http({
                    method: 'GET',
                    url: 'https://whsatku.github.io/skecourses/sections/' + id + '.json',
                })
            };
        }
    });