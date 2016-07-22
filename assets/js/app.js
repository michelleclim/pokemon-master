(function(angular){
	'use strict';

	var app = angular.module('pokemon-app', []);

	app.component('pokemonMaster', {
		templateUrl: 'templates/pokemon-card.html',
		controller: ['$http', function($http) {
			var self = this;
			var pokemon;
			self.pokemonList = [];
			self.generatePokemon = generatePokemon;

			function generatePokemon () {
				var pokeId = Math.floor(Math.random()*150) + 1;
				$http.get('https://pokeapi.co/api/v2/pokemon/' + pokeId)
					.then(function(response){
						self.pokemonList.push(response.data);
					});
			}

			for (var i = 0; i < 10; i++) {
				generatePokemon();
			}
		}]
	});

})(angular);