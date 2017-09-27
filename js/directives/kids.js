/*
 *  Copyright (C) 2017 Popinz.co
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 (function(){
    var kids = angular.module("kidsInfo", []);

    kids.directive("kids", function(){
        return{
            restrict: 'E',
            templateUrl: "partials/directives/kids.html"/*,
            controller: ["$scope", function($scope){
                $scope.ages = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

                $scope.addChild = function(){
                    $scope.parent.kidsInfo.push({age : 0});
                    $scope.parent.numberOfChildren++;
                }
            }]*/
        }
    });
})();