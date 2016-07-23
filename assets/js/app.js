(function(angular){
	'use strict';

	var app = angular.module('pokemon-app', []);

	app.service('pokemonDataService', ['$http', function($http){
		var self = this;
		var pokemonList = [];
		var generatePokemon = generatePokemon;

		function generatePokemon () {
			var pokeId = Math.floor(Math.random()*150) + 1;
			$http.get('https://pokeapi.co/api/v2/pokemon/' + pokeId)
				.then(function(response){
					pokemonList.push({
						name: response.data.name,
						id: response.data.id,
						image: response.data.sprites.front_default,
						value: ''
					});
				});
		}

		for (var i = 0; i < 10; i++) {
			generatePokemon();
		}

		return pokemonList;
	}]);

	app.component('pokemonMaster', {
		templateUrl: 'templates/pokemon-card.html',
		controller: ['pokemonDataService', function(pokemonDataService) {
			var self = this;
			self.pokemonList = pokemonDataService;

		}]
	});

})(angular);