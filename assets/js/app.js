(function(angular){
	'use strict';

	var app = angular.module('pokemon-app', ['ui.router']);

	app.config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/home');
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'templates/main.html'
			})
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
		var getPokemonData = getPokemonData;
		var getPokemon = getPokemon;
		var generatePokemon = generatePokemon;

		function getPokemonData() {
			return $http.get('/src/pokemon-with-images.json');
		}

		function getPokemon(data) {
			for (const value of data) {
				if (value.nationalPokedexNumber <= 150) {
					pokemonData.push(value);
				}
			}

			for (var i = 0; i < 10; i++) {
				generatePokemon();
			}

			return pokemonList;
		}

		function generatePokemon () {
			var pokeId = Math.floor(Math.random()*149) + 1;
			pokemonList.push(pokemonData[pokeId]);
		}

		return {
			getPokemonData: getPokemonData,
			getPokemon: getPokemon
		};
	}]);

	app.service('pokemonCardData', function(){
		return {
			data: []
		}
	});

	app.controller('resultsCtrl', ['pokemonCardData', 'pokemonDataService', '$state', '$window', function(pokemonCardData, pokemonDataService, $state, $window) {
		var self = this;
		self.totalScore = 0;
		self.pokemonLevel = '';
		self.pokemon = pokemonCardData.data;
		self.pokemonDataService = pokemonDataService;
		self.countScore = countScore;
		self.checkPokemonLevel = checkPokemonLevel;
		self.replay = replay;

		countScore();
		checkPokemonLevel();

		function countScore() {

			for (var i = 0; i < self.pokemon.length; i++) {
				if (self.pokemon[i].nameKey === self.pokemon[i].response) {
					self.totalScore+=10;
				}
			}

			return self.totalScore;
		}

		function checkPokemonLevel() {
			switch (true) {
				case (self.totalScore < 50):
					self.pokemonLevel = 'noob';
					break;
				case (self.totalScore < 70):
					self.pokemonLevel = 'novice';
					break;
				case (self.totalScore < 90):
					self.pokemonLevel = 'trainer';
					break;
				default:
					self.pokemonLevel = 'master';
					break;
			}
		}

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
			function(
				pokemonDataService, 
				pokemonCardData, 
				$state
			) {
				var self = this;
				self.pokemonCard = pokemonCardData.data;
				self.pokemonList = [];
				self.index = 0;
				self.response = '';
				self.loading = true;

				self.updateIndex = updateIndex;
				self.submitResponse = submitResponse;
				self.checkProgress = checkProgress;


				pokemonDataService.getPokemonData()
					.then(function(response){
						self.data = response.data.body;
						self.pokemonList = pokemonDataService.getPokemon(self.data);
						self.loading = false;
						updateIndex();
					});

				function updateIndex() {
					self.currentPokemon = self.pokemonList[self.index];
					self.response = '';
					self.index++;
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
				}

				function checkProgress() {
					if (self.index > 10) {
						$state.go('results');
					}
				}
		}]
	});

})(angular);