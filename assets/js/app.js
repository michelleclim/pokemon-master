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
				templateUrl: 'templates/results.html',
				controller: 'resultsCtrl',
				controllerAs: 'results'
			})
	}]);

	app.service('pokemonDataService', ['$http', function($http){
		var self = this;
		var pokemonData = [];
		var pokemonList = [];
		var getPokemon = getPokemon;
		var generatePokemon = generatePokemon;

		$http.get('/src/pokemon-with-images.json')
			.then(function(response){
				self.data = response.data.body;
				getPokemon();
			});

		function getPokemon() {
			for (const value of self.data) {
				if (value.nationalPokedexNumber <= 150) {
					pokemonData.push(value);
				}
			}

			for (var i = 0; i <= 5; i++) {
				generatePokemon();
			}
		}

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

	app.controller('resultsCtrl', ['pokemonCardData', 'pokemonDataService', '$state', '$window', function(pokemonCardData, pokemonDataService, $state, $window) {
		var self = this;
		self.pokemon = pokemonCardData.data;
		self.pokemonDataService = pokemonDataService;
		self.replay = replay;

		function replay() {
			$state.go('pokemon');
			$window.location.reload();
		}

	}]);

	app.component('pokemonCard', {
		templateUrl: 'components/pokemon-card.html',
		controller: [
			'pokemonDataService', 
			'pokemonCardData', 
			'$state', 
			'$timeout', 
			function(
				pokemonDataService, 
				pokemonCardData, 
				$state, 
				$timeout
			) {
				var self = this;
				self.pokemonList = pokemonDataService;
				self.pokemonCard = pokemonCardData.data;
				self.index = 0;
				self.response = '';

				self.updateIndex = updateIndex;
				self.submitResponse = submitResponse;
				self.checkProgress = checkProgress;

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
					checkProgress();
					console.log(self.pokemonCard);
				}

				function checkProgress() {
					if (self.index > 5) {
						$state.go('results');
					}
				}

				$timeout(function(){updateIndex();}, 100);

		}]
	});

})(angular);