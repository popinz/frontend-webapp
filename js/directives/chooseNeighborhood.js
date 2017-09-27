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
	var chooseNeighborhood = angular.module('chooseNeighborhood', ["publicEnumTypes"]);

	//TO DO: extract this service from here and move to services

	chooseNeighborhood.service("neighborhoodsService", ["enumService", function(enumService){
	    var jerNeighborhoods = enumService.getPropertyOfSingleEnum("City", "JERUSALEM", "insideNeighborhoods");
        var jerNeighborhoodsSplitted = [];
        for(var i = 0; i < jerNeighborhoods.length; i++)
        {
            if(!jerNeighborhoodsSplitted[jerNeighborhoods[i].neighborhoodIndex])
                jerNeighborhoodsSplitted[jerNeighborhoods[i].neighborhoodIndex] = [];
            jerNeighborhoodsSplitted[jerNeighborhoods[i].neighborhoodIndex].push(jerNeighborhoods[i]);
        }

        this.jerusalemParts = function(sitter)
        {
            var neighborhoods = angular.copy(jerNeighborhoodsSplitted);
            if(sitter && sitter.neighborhoodsWork)
            {
                for(var i = 0; i<neighborhoods.length; i++)
                {
                    for(var j = 0; j<neighborhoods[i].length; j++)
                    {
                        for(var k = 0; k < sitter.neighborhoodsWork.length; k++)
                        {
                            if(neighborhoods[i][j].name === sitter.neighborhoodsWork[k])
                            {
                                neighborhoods[i][j].checked = true;
                                {break;}
                            }
                        }
                    }
                }
            }
            if(sitter && sitter.neighborhood)
            {
                for(var i = 0; i<neighborhoods.length; i++)
                {
                    for(var j = 0; j<neighborhoods[i].length; j++)
                    {
                        if(neighborhoods[i][j].name === sitter.neighborhood)
                        {
                            neighborhoods[i][j].checked = true;
                            {break;}
                        }
                    }
                }
            }
            return neighborhoods;
        }

        this.getCheckedNeighborhoods = function(jerusalemParts)
        {
            var checkedNeighborhoods = [];
            for(var i = 0; i < jerusalemParts.length; i++)
            {
                for(var j = 0; j < jerusalemParts[i].length; j++)
                {
                    if(jerusalemParts[i][j].checked)
                       checkedNeighborhoods.push(jerusalemParts[i][j].name);
                }
            }
            return checkedNeighborhoods;
        }
	}]);
	chooseNeighborhood.directive("chooseNeighborhood", ["neighborhoodsService", function(neighborhoodsService){
        return{
            restrict:'E',
            templateUrl: "partials/directives/chooseNeighborhood.html",
            controller: ["$scope", function($scope){
                $scope.jerusalemParts = neighborhoodsService.jerusalemParts($scope.sitter);

                //gets jerusalemParts from neigborhoods service
                //wich is a full array of neigborhoods splited and prechecked
                $scope.$watch('sitter', function(e) {
                    if($scope.sitter && $scope.sitter.neighborhoodsWork){
                        $scope.jerusalemParts = neighborhoodsService.jerusalemParts($scope.sitter);
                        $scope.checkedNeighborhoods = $scope.sitter.neighborhoodsWork;
                    }

                });

                //gathers names of checked checkboxes
                //the function is called on popup window button click
                $scope.getCheckedNeighborhoods = function()
                {
                    $scope.checkedNeighborhoods = neighborhoodsService.getCheckedNeighborhoods($scope.jerusalemParts);
                    if($scope.checkedNeighborhoods.length === 0)
                        $scope.sitter.jerusalemWork = false;
                }

                //listens to gatherNeighborhoods event coming from parent
                $scope.$on("gatherNeighborhoods", function(e){
                    //extract additional arguments for further actions
                     $scope.additionalArgs=Array.prototype.slice.call(arguments).splice(1);
                     //publishes gathered event and returns checkedCities to the parent
                     $scope.$emit("gathered", "neighborhoods", $scope.checkedNeighborhoods, $scope.additionalArgs);

                });
            }]
        };
    }]);
})();