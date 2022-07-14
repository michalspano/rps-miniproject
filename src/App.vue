<script setup>
import { ref, computed , onMounted } from 'vue';

// counter buffers
const wins = ref(0); const draws = ref(0); const losses = ref(0);

// choice buffers and the final verdict
const choice = ref(null); 
const computedChoice = ref(null); 
const verdict = ref(null);

// we assign each choice a value, whether we win, draw or lose
const OUTCOMES = {
    rock: 		{ rock: 'draw', paper: 'loss',scissors: 'win'  },
    paper: 		{ rock: 'win', paper: 'draw', scissors: 'loss' },
    scissors: 	{ rock: 'loss', paper: 'win', scissors: 'draw' }
}

// here we calculate the user's overall winrate
const winRatePercentage = computed(() => {
    const total = wins.value + draws.value + losses.value;
    return total ? (wins.value / total) * 100 : 0;
});

// get a random choice from the list of choices - computer move
const computeRandomChoice = () => {
	const choices = Object.keys(OUTCOMES);
	return choices[Math.floor(Math.random() * choices.length)];
}

const play = userChoice => {
	choice.value = userChoice;  // append the user's choice

	// get the computer's choice
	const computerChoice = computeRandomChoice();
    computedChoice.value = computerChoice;  // append the computer's choice

	// get the outcome
	const outcome = OUTCOMES[userChoice][computedChoice.value];

	// evaluation
    if (outcome === 'win') {
		wins.value++;
     	verdict.value = 'You win!';
  	} else if (outcome === 'loss') {
    	losses.value++;
    	verdict.value = 'You lose!';
  	} else {
    	draws.value++;
    	verdict.value = 'Draw!';
  	}
  	SaveGame();
}

// save the progress to localStorage
const SaveGame = () => {
	localStorage.setItem('wins', wins.value);
	localStorage.setItem('draws', draws.value);
	localStorage.setItem('losses', losses.value);
}

// load from localStorage
const loadGame = () => {
	wins.value 	 = parseInt(localStorage.getItem('wins'))   || 0;
	draws.value  = parseInt(localStorage.getItem('draws'))  || 0;
	losses.value = parseInt(localStorage.getItem('losses')) || 0;
}

// make all null
const ResetRound = () => {
  choice.value = null; computedChoice.value = null; verdict.value = null;
}

// reset localStorage
const ResetGame = () => {
	localStorage.clear();
	window.location.reload();
}

onMounted(() => {
  loadGame();

  window.addEventListener('keypress', event => {
    if (event.key === 'n') {
      ResetRound();
    }
	else if (event.key === 'r') {
		ResetGame();
	}
	// we are only able to use 1,2,3 on the main page
	if (choice.value === null ) {
		if (event.key === '1') {
			play('rock');
		}
		else if (event.key === '2') {
			play('paper');
		}
		else if (event.key === '3') {
			play('scissors');
		}
	}
  });
});

</script>

<template>
	<div class="bg-gray-600 text-white text-center min-h-screen flex flex-col">
		<header class="container mx-auto p-8">
			<h1 class="text-5xl font-bold">Rock, Paper, Scissors - <code>RPS</code></h1>
		</header>
		<main class="container mx-auto p-6 flex-1">
			<div v-if="choice === null" class="flex items-center justify-center -mx-6">
				<button @click="play('rock')"
					class="bg-gray-100 rounded-full shadow-xl w-64 mx-6 p-5 transition-colors duration-300 hover:bg-blue-500">
					<img src="./assets/rock.svg"
						alt="Rock" class="w-full" />
				</button>
				<button @click="play('paper')"
					class="bg-gray-100 rounded-full shadow-xl w-64 mx-6 p-5 transition-colors duration-300 hover:bg-green-500">
					<img src="./assets/paper.svg"
						alt="Paper" class="w-full" />
				</button>
				<button @click="play('scissors')"
					class="bg-gray-100 rounded-full shadow-xl w-64 mx-6 p-5 transition-colors duration-300 hover:bg-yellow-500">
					<img src="./assets/scissors.svg" alt="Scissors" class="w-full" />
				</button>
			</div>

			<div v-else>
				<div class="text-4xl mb-4">
					You: <span class="text-green-500">{{ choice }}</span>
				</div>
				<div class="text-4xl mb-4">
					Bot: <span class="text-red-400">{{ computedChoice }}</span>
				</div>
				<div class="text-5xl mb-12">
					{{ verdict }}
				</div>
				<button @click="ResetRound()"
					class="bg-yellow-500 text-lg py-2 px-5 shadow-md rounded-md">Repeat</button>
			</div>

			<div class="mt-12 text-4xl mb-4">
				{{ wins }} : {{ draws }} : {{ losses }}
			</div>
			<div class="text-xl">
				Win rate: {{ Math.round(winRatePercentage) }}%
			</div>
			<div
				class="text-lg bg-gray-100 shadow-lg w-80 p-6 mx-auto mt-10 rounded-xl text-gray-700 transition-colors duration-300 hover:bg-white">
				<div class="text-2xl mb-2 text-center">Shortcuts</div>
				<p class="text-lg font-semibold text-center">
					Press <span class="text-blue-500">1</span> - <span class="text-green-500">2</span> -
					<span class="text-yellow-500">3</span> to play<br>
					Press <span class="text-purple-500">N</span> to draw again<br>
					Press <span class="text-pink-500">R</span> to reset game
				</p>
			</div>
		</main>
	</div>
</template>
