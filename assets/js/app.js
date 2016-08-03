(function(angular){
	'use strict';

	var app = angular.module('pokemon-app', ['ui.router']);

	app.config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/pokemon');
		$stateProvider
			.state('pokemon', {
				url: '/pokemon',
				template: '<pokemon-card></pokemon-card>'
			})
			.state('results', {
				url: '/results',
				template: ''
			})
	}]);

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
		}
	});

	app.service('pokemonCardData', function(){
		return {
			data: []
		}
	});

	app.component('pokemonCard', {
		templateUrl: 'templates/pokemon-card.html',
		controller: ['pokemonDataService', 'pokemonCardData', '$timeout', function(pokemonDataService, pokemonCardData, $timeout) {
			var self = this;
			self.pokemonList = pokemonDataService;
			self.pokemonCard = pokemonCardData.data;
			self.index = 0;
			self.response = '';

			self.updateIndex = updateIndex;
			self.submitResponse = submitResponse;

			function updateIndex() {
				self.index++;
				self.currentPokemon = self.pokemonList[self.index];
				self.response = '';
			}

			function submitResponse() {
				self.pokemonCard.push({
					nameKey: self.currentPokemon.pokemonName.toLowerCase(),
					imageUrl: self.currentPokemon.imageUrl,
					pokedexNumber: self.currentPokemon.nationalPokedexNumber,
					response: self.response.toLowerCase()
				});
				updateIndex();
				console.log(self.pokemonCard);
			}

			$timeout(function(){updateIndex();}, 100);

		}]
	});

})(angular);