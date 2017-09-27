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
    'use strict';
    var saveStateModule = angular.module("saveStateModule", ["publicEnumTypes", "authenticationModule"]);
    saveStateModule.service("saveStateService", ['$rootScope', '$routeParams', '$location', 'authenticationService', '$q', "enumService", function($rootScope, $routeParams, $location, authenticationService, $q, enumService){
        var self = this;
        var data = {};
        this.set = function(obj){
            data = obj;
        };
        this.get = function(){
            return data;
        };
        this.empty = function(){
            data = {};
        };

        this.checkProfileLanguage = function(response){
            this.set(response);
            var res;
            if($routeParams.langId === 'en' && response.result.firstNameEn === undefined && response.result.firstNameHe !== undefined){
                $location.path('/signup/he');
            }
            else if($routeParams.langId === 'he' && response.result.firstNameHe === undefined && response.result.firstNameEn !== undefined){
                $location.path('/signup/en');
            }
            else if(!$rootScope.user.creds || angular.equals($rootScope.user.creds.accountId, {})){
                authenticationService.refreshCredentials($rootScope);
                $location.path('/signup/' + $routeParams.langId);
            }
            else {
                var desiredPath = '/signup/' + $routeParams.langId;
                var actualPath = $location.path();
                if(actualPath === desiredPath)
                    res = self.restoreSignupState(response);
                else
                    $location.path('/signup/' + $routeParams.langId);
            }
            return res;
         };

        this.restoreSignupState = function(response){
            response.sitterDetails = {"currentStep" : 0};
            if(response.result.age === 0)
                delete response.result.age;
            if(response.result.homeNumber === 0)
                delete response.result.homeNumber;
            if (response.userType === 'sitter')
            {
                response.steps = enumService.getEnum("SignUpStage");
                if (response.result.signUpStage !== 'START') {
                    //update names in rootScope and cookies
                    authenticationService.updateNames(response.result.firstNameEn, response.result.lastNameEn, response.result.firstNameHe, response.result.lastNameHe);

                    for (var i = 0; i < response.steps.length; i++) {
                        if (response.steps[i].name === response.result.signUpStage) {
                            response.sitterDetails.currentStep = i;
                            {break;}
                        }
                    }
                    if (response.sitterDetails.currentStep !== response.steps.length - 1) {
                        response.sitterDetails.currentStep++;
                        hj('vpv', '/sign-up/' + response.sitterDetails.currentStep);
                    }
                    response.result.signUpStage = response.steps[response.sitterDetails.currentStep].name;
                    //if currentStep turns out to be "COMPETED", redirect to sitter profile
                    if (response.result.signUpStage === "COMPLETED") {
                        //before redirecting empty sitter object in saveStateService.
                        //so that if a user returns from sitter profile to signup,
                        //he would see the zero step of signup
                        this.empty();
                        $location.path('/sitter-profile/' + $rootScope.lang);
                    }
                }
                else{
                    response.sitterDetails.currentStep++;
                    hj('vpv', '/sign-up/' + response.sitterDetails.currentStep);
                }
            }
            else {
                // Put a COMING SOON page?
                //$location.path('/main/' + $rootScope.lang);
                if(response.result.signUpStage === "COMPLETED")
                    $location.path('/parent-profile/' + $rootScope.lang);
                else
                    response.sitterDetails.currentStep++;
            }
            return response;
        };
    }]);
})();