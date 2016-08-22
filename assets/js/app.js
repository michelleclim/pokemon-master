(function(angular){
	'use strict';

	var app = angular.module('pokemon-app', ['ui.router']);

	app.config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state('home', {
				url: '/',
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
		var idList = [];
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
			var pokeId;
			do {
				pokeId = Math.floor(Math.random()*150);
			}
			while (idList.indexOf(pokeId) > -1);
			idList.push(pokeId)
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
		self.similarity = similarity;
		self.editDistance = editDistance;
		self.countScore = countScore;
		self.checkPokemonLevel = checkPokemonLevel;
		self.replay = replay;

		countScore();
		checkPokemonLevel();

		function similarity(s1, s2) {
			var longer = s1;
			var shorter = s2;
			if (s1.length < s2.length) {
				longer = s2;
				shorter = s1;
			}
			var longerLength = longer.length;
			if (longerLength == 0) {
				return 1.0;
			}
			return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
		}

		function editDistance(s1, s2) {
			s1 = s1.toLowerCase();
			s2 = s2.toLowerCase();

			var costs = new Array();
			for (var i = 0; i <= s1.length; i++) {
				var lastValue = i;
				for (var j = 0; j <= s2.length; j++) {
					if (i == 0)
					costs[j] = j;
					else {
					if (j > 0) {
					var newValue = costs[j - 1];
					if (s1.charAt(i - 1) != s2.charAt(j - 1))
					newValue = Math.min(Math.min(newValue, lastValue),
					costs[j]) + 1;
					costs[j - 1] = lastValue;
					lastValue = newValue;
					}
					}
				}
				if (i > 0)
				costs[s2.length] = lastValue;
			}
			return costs[s2.length];
		}

		function countScore() {

			for (var i = 0; i < self.pokemon.length; i++) {
				self.pokemon[i].pointValue = Math.round((self.similarity(self.pokemon[i].nameKey, self.pokemon[i].response))*10);
				self.totalScore += self.pokemon[i].pointValue;
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
						response: self.response.toLowerCase(),
						pointValue: 0
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