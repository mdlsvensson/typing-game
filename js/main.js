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
// Timer start variable
let wpmStart;
// Selected word count
let wordCount;

// Async fetch function
async function fetchWords() {
  // Fetch words
  const response = await fetch('https://myjson.dit.upm.es/api/bins/ci5l');

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

function stopGame() {
  // Change stop button to say "start"
  startButtonEl.innerHTML = 'start';
  // Reset DOM and array
  gameAreaEl.innerHTML = '';
  activeWords = [];
}

// Game function
startButtonEl.addEventListener('click', event => {

  startButtonEl.blur();

  // Game started switch
  gameStarted = !gameStarted;

  // If game is being started
  if (gameStarted === true) {

    // Set the wordcount
    wordCount = wordCountEl.value;

    // Get initial words
    fetchWords()
      .then(data => {
      
        //Start timer
        wpmStart = new Date();
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
      }

      // Change start button to say "stop"
      startButtonEl.innerHTML = 'stop';
    });
  }
  
  // If game is being stopped
  if (gameStarted === false) {
    stopGame();
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

  // When last word is typed
  if (activeWords.length === 1) {
    // Stop the timer
    let wpmEnd = new Date();
    // Timer calculation
    let timeDiff = wpmEnd - wpmStart;
    timeDiff /= 1000;
    // Get the words per minute
    let wpmResult = Math.round(wordCount / (timeDiff / 60));
    // Get the seconds elapsed
    let seconds = Math.round(timeDiff);
    // Show result message
    gameAreaEl.innerHTML = `<p class="word" style="color: green;">${wordCount} words in ${seconds} seconds. ${wpmResult} WPM.</p>`
  }

});