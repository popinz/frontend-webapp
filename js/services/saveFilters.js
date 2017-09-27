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
    var saveFilters = angular.module("saveFiltersModule", []);
    saveFilters.service("saveFiltersService", function(){
        var self = this;
        var data;

        this.saveFilters = function(filters, results, searchInstance, sitter){
            data = {'filters' : filters, 'results' : results, 'searchInstance' : searchInstance, 'id' : sitter.id, 'clickedSitter' : sitter};
        };

        this.getFilters = function(){
            return data;
        };

        this.emptyFilters = function(){
            data = null;
        };

        this.deleteSitter = function(){
            data.clickedSitter = null;
        }

        this.getSitter = function(){
            if(data)
                return data.clickedSitter;
            else
                return null;
        }
    });
})();