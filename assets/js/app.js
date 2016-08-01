(function(angular){
	'use strict';

	var app = angular.module('pokemon-app', []);

	app.service('pokemonDataService', ['$http', function($http){
		var self = this;
		var pokemonData = [];
		var pokemonList = [];
		var generatePokemon = generatePokemon;

		$http.get('/src/pokemon-with-images.json')
			.then(function(response){
				self.data = response.data.body;
				for (const value of self.data) {
					if (value.nationalPokedexNumber <= 150) {
						pokemonData.push(value);
					}
				}

				for (var i = 0; i < 20; i++) {
					generatePokemon();
				}
			});

		function generatePokemon () {
			var pokeId = Math.floor(Math.random()*149) + 1;
			pokemonList.push(pokemonData[pokeId]);
		}

		return pokemonList;
	}]);

	app.service('pokemonIndex', function(){
		this.index = 0;
		this.updateIndex = updateIndex;

		function updateIndex () {
			this.index++;
			console.log(this.index);
		}
	});

	app.component('pokemonCard', {
		templateUrl: 'templates/pokemon-card.html',
		controller: ['pokemonDataService', 'pokemonIndex', '$timeout', function(pokemonDataService, pokemonIndex, $timeout) {
			var self = this;
			self.pokemonList = pokemonDataService;
			self.pokemonIndex = pokemonIndex;
			self.index = 0;

			self.updateIndex = updateIndex;

			function updateIndex() {
				self.index++;
				self.currentPokemon = self.pokemonList[self.index];
			}

			$timeout(function(){updateIndex(); console.log(self.pokemonList)}, 100);

		}]
	});

})(angular);