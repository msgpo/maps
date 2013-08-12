/**
 * ownCloud - Maps app
 *
 * @author Qingping Hou
 *
 * @copyright 2013 Qingping Hou <qingping.hou@gmail.com>
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 *
 */


angular.module('Maps').controller('MainController',
['$scope', '$rootScope', '$routeParams', '$http',
function ($scope, $rootScope, $routeParams, $http) {
	$scope.is_show_nav = false;
	//$scope.is_show_search = false;
	$scope.is_show_search = true;
	//$scope.is_show_nav = true;

	$scope.showNavBar = function () {
		$scope.is_show_nav = true;
	};

	$scope.hideNavBar = function () {
		$scope.is_show_nav = false;
	};

	$scope.toggleSearchBar = function () {
		$scope.is_show_search = !$scope.is_show_search;
	};

	$scope.$watch('search_keyword', function (newval) {
	});

	$scope.searchByAddress = function () {
		var address = $scope.search_keyword;
		if (address !== '') {
			$http({
				method: 'GET',
				url: '//open.mapquestapi.com/nominatim/v1/search',
				params: {
					'format': 'json',
					'q': address,
				}
			}).
				success(function (data, status) {
					//for (var i in data) {
						//console.log(data[i]);
					//}
					var first_re = data[0];
					var boundingbox = first_re.boundingbox;
					var south_west = {
						lat: parseFloat(boundingbox[0]),
						lng: parseFloat(boundingbox[2])
					};
					var north_east = {
						lat: parseFloat(boundingbox[1]),
						lng: parseFloat(boundingbox[3])
					};
					// broadcast event for map controller
					$rootScope.$broadcast('updateFocus', {
						'coordinate': {
							'lat': parseFloat(first_re.lat),
							'lng': parseFloat(first_re.lon),
						},
						'bounds': {
							southWest: south_west,
							northEast: north_east,
						},
					});
				});

			$rootScope.$broadcast('cleanCollection');
		}
	};

	$scope.search_complete_source = ['abc', 'cba'];
}]);
