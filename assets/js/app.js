(function(angular){
	'use strict';

	var app = angular.module('pokemon-app', []);

	app.service('pokemonDataService', ['$http', '$q', function($http, $q){
		var self = this;
		var pokemonList = [];
		var generatePokemon = generatePokemon;

		$http.get('/src/pokemon-with-images.json')
			.then(function(response){
				self.data = response.data.body;
				for (var i = 0; i < 20; i++) {
					generatePokemon();
				}
			});

		function generatePokemon () {
			var pokeId = Math.floor(Math.random()*150) + 1;
			pokemonList.push(self.data[pokeId]);
		}

		return pokemonList;
	}]);

	app.service('pokemonIndex', function(){
		this.index = 0;
		this.updateIndex = updateIndex;

		function updateIndex () {
			this.index++;
		}
	});

	app.component('pokemonCard', {
		templateUrl: 'templates/pokemon-card.html',
		controller: ['pokemonDataService', 'pokemonIndex', '$timeout', function(pokemonDataService, pokemonIndex, $timeout) {
			var self = this;
			self.pokemonList = pokemonDataService;
			self.pokemonIndex = pokemonIndex;
			self.currentPokemon = self.pokemonList[self.pokemonIndex.index];

			$timeout(function(){self.currentPokemon = self.pokemonList[0];}, 2000);

		}]
	});

})(angular);