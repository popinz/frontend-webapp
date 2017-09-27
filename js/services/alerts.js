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
    var alerts = angular.module("alertsModule", ["translateModule"]);
    alerts.service("alertsService", ["translateService", "$rootScope", function(translateService, $rootScope){
        this.showAlert = function(message)
        {
            if(message.code !== undefined) {
                alert(message.message);
                return;
            }
            if(message.startsWith("java.security.AccessControlException")){
                alert(translateService.getTranslation("WRONG_PASSWORD_ALERT", $rootScope.lang));
            }
            else if(message === "Profile exists as a sitter profile"){
                alert(translateService.getTranslation("SECOND_ACCOUNT_ALERT1", $rootScope.lang)+
                    translateService.getTranslation("SITTER", $rootScope.lang) +
                        translateService.getTranslation("SECOND_ACCOUNT_ALERT2", $rootScope.lang));
            }
            else if(message === "Profile exists as a parent profile"){
                alert(translateService.getTranslation("SECOND_ACCOUNT_ALERT1", $rootScope.lang)+
                    translateService.getTranslation("PARENT", $rootScope.lang) +
                        translateService.getTranslation("SECOND_ACCOUNT_ALERT2", $rootScope.lang));
            }
            else if(message === "Email/Username or password is incorrect"){
                alert(translateService.getTranslation('EMAIL_OR_PASSWORD_INCORRECT', $rootScope.lang));
            }
            else if(message === "First time user"){
                alert(translateService.getTranslation('FIRST_TIME_USER_ALERT', $rootScope.lang));
            }
            else if(message === "Invalid confirmation code"){
                alert(translateService.getTranslation('INVALID_CONFIRMATION', $rootScope.lang));
            }
            else{
                alert(translateService.getTranslation("GENERAL_ALERT", $rootScope.lang));
            }
        }

    }]);
})();