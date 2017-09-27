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
    var contactSitter = angular.module("contactSitter", ['sitterDirectives', "kidsInfo", "alertsModule", 'translateModule']);

    contactSitter.directive("contactSitter", function(){
        return{
            restrict: 'E',
            templateUrl: "partials/directives/contact-sitter.html",
            controller: ["$scope", "$rootScope", "alertsService", "$window", "translateService", function($scope, $rootScope, alertsService, $window, translateService){
                $scope.$watch("parent_api_ready", function(){
                    if($scope.parent_api_ready && $rootScope.user.creds && !angular.equals({}, $rootScope.user.creds.accountId) && $rootScope.user.userType === "parent"){
                        gapi.client.parentProfileApi.getParentProfile($rootScope.user.creds).execute(function(response){
                            if(response.result && !response.error){
                                $scope.parent = response.result;
                                if(!$scope.parent.secondEmail)
                                    $scope.parent.secondEmail = $scope.parent.email;
                                /*if(!$scope.parent.kidsInfo){
                                    $scope.parent.kidsInfo = [{age : 0}];
                                    $scope.parent.numberOfChildren = 1;
                                }*/
                                $scope.contactMe = {"email" : false, "phone" : false};
                                $scope.$apply();
                            }
                        });
                    }
                });

                $scope.submit = function(){
                    if(!$scope.contactMe.phone && !$scope.contactMe.email){
                        $scope.noContactMethod=true;

                        $('#contactSitterModal').animate({ scrollTop: 0 }, 'slow');
                        return;
                    }
                    $scope.sendEmail();
                }

                $scope.getFirstName = translateService.getBestName;

                $scope.sendEmail = function(){
                    $scope.$watch("connection_api_ready", function(){
                        if($scope.connection_api_ready){
                            var request =$.extend({}, $scope.parent, $rootScope.user.creds, {'contactSitterId' :$scope.sitter.id, 'byEmail' : $scope.contactMe.email, 'byPhone' : $scope.contactMe.phone});

                            gapi.client.connectionRequestApi.contactSitter(request).execute(function(response){
                                if(response.result && !response.error){
                                    $('#contactSitterModal').modal("hide");
                                    $('#successContactModal').modal();
                                }
                                else{
                                    alertsService.showAlert(response.error.message);
                                }
                            });
                        }
                    })
                }
            }]
        }
    });

})();