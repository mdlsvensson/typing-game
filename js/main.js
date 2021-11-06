// Strict mode
"use strict";

// GET ELEMENTS
// Main game area
const gameAreaEl = document.getElementById('game-area-js');
// Game start button
const startButtonEl = document.getElementById('start-button-js');
// Text input field
const typeFieldEl = document.getElementById('type-field-js');
// Word count select box (dropdown)
const wordCountEl = document.getElementById('word-count-js');

// Game start/stop check
let gameStarted = false;

// Async fetch function
async function fetchWords() {
  // Fetch words
  const response = await fetch('http://myjson.dit.upm.es/api/bins/ci5l');

  // if Error
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Response.json
  const json = await response.json();

  return json;
}

// Active words to type array
let activeWords = [];

// Game function
startButtonEl.addEventListener('click', event => {

  startButtonEl.blur();

  // Game started switch
  gameStarted = !gameStarted;

  // If game is being started
  if (gameStarted === true) {

    // Get initial words
    fetchWords()
      .then(data => {
      
        //Start timer
        let wpmStart = new Date();
        let words = data.data;
        for (let i = 0; i < wordCountEl.value; i++) {
        
        // Initial variable declaration for the random word/space
        let random;

        // If index is an even number
        if (i % 2 === 0) {
          // Get random 200 words from fetch data
          random = words[Math.floor(Math.random() * words.length)];

          // Reroll if duplicate
          while (activeWords.includes(random)) {
            random = words[Math.floor(Math.random() * words.length)];
          }
        }

        // If index is an odd number insert space
        if (i % 2 != 0) {
          random = ' ';
        }

        // Create elements
        let newEl = document.createElement('p');
        gameAreaEl.appendChild(newEl);
        // Create text node for element
        let newTextNode = document.createTextNode(random);
        newEl.appendChild(newTextNode);

        // Set css class to new elements
        newEl.classList.add('word');

        // Push words to active words array
        activeWords.push(random);
          
        if (activeWords.length === 0) {
          let wpmEnd = new Date();
          let timeDiff = wpmEnd - wpmStart;
          timeDiff /= 1000;
          
          let seconds = Math.round(timeDiff);
          console.log(seconds + ' seconds.')
        }   
      }

      // Change start button to say "stop"
      startButtonEl.innerHTML = 'stop';
    });
  }
  
  // If game is being stopped
  if (gameStarted === false) {
    // Change stop button to say "start"
    startButtonEl.innerHTML = 'start';
    // Reset DOM and array
    gameAreaEl.innerHTML = '';
    activeWords = [];
  }
});

// Register Keypresses and update DOM/Array
document.addEventListener('keydown', event => {
  // If game is not started, return
  if (gameStarted === false) return;

  // Get the pressed key and the next letter to be typed
  let pressedKey = event.key.toLowerCase();
  let correctKey = activeWords[0].substring(0, 1);

  // If correct letter is pressed
  if (pressedKey === correctKey) {
    // Remove first character from first string of array
    activeWords[0] = activeWords[0].substring(1);
    gameAreaEl.children[0].innerHTML = activeWords[0];
  }
  // If word is fully typed, shift array
  if (activeWords[0].length === 0) {
    activeWords.shift();
    gameAreaEl.removeChild(gameAreaEl.firstChild);
  }

});