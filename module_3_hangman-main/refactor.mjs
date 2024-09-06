//#region Dont look behind the curtain
// Do not worry about the next two lines, they just need to be there. 
import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });

async function askQuestion(question) {
    return await rl.question(question);
}

//#endregion

import { ANSI } from './ansi.mjs';
import { HANGMAN_UI } from './graphics.mjs';
import { readFileSync } from 'node:fs';

const collectWordsFromTxt = readFileSync('./words.txt').toString('utf8').split("\r\n");
const correctWord = collectWordsFromTxt[Math.floor(Math.random()*collectWordsFromTxt.length)].toLowerCase();
const numberOfCharInWord = correctWord.length;
let guessedWord = "".padStart(correctWord.length, "_"); // "" is an empty string that we then fill with _ based on the number of char in the correct word.
let wordDisplay = "";
let isGameOver = false;
let wasGuessCorrect = false;
let wrongGuesses = [];

//wordDisplay += ANSI.COLOR.GREEN;

function drawWordDisplay() {

    wordDisplay = "";

    for (let i = 0; i < numberOfCharInWord; i++) {
        //i == 0, wordDisplay == "", guessedWord[0] == "_";
        //i == 1, wordDisplay == "_ ", guessedWord[1] == "_";
        //i == 2, wordDisplay == "_ _ ", guessedWord[2] == "_";
        if (guessedWord[i] != "_") {
            wordDisplay += ANSI.COLOR.GREEN;
        }
        wordDisplay = wordDisplay + guessedWord[i] + " ";
        wordDisplay += ANSI.RESET;
        //i == 0, wordDisplay == "_ ", guessedWord[0] == "_";
        //i == 1, wordDisplay == "_ _ ", guessedWord[1] == "_";
        //i == 2, wordDisplay == "_ _ _", guessedWord[2] == "_";
    }

    return wordDisplay;
}

function drawList(list, color) {
    let output = color;
    for (let i = 0; i < list.length; i++) {
        output += list[i] + " ";
    }

    return output + ANSI.RESET;
}

// Continue playing until the game is over. 
while (isGameOver == false) {

    console.log(ANSI.CLEAR_SCREEN);
    console.log(drawWordDisplay());
    console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
    console.log(HANGMAN_UI[wrongGuesses.length]);

    const answer = (await askQuestion("Guess a character or the word : ")).toLowerCase();

    if (answer == correctWord) {
        isGameOver = true;
        wasGuessCorrect = true;     
    } else if (ifPlayerGuessedLetter(answer)) {

        let org = guessedWord;
        guessedWord = "";

        let isCorrect = false;
        for (let i = 0; i < correctWord.length; i++) {
            if (correctWord[i] == answer) {
                guessedWord += answer;
                isCorrect = true;
            } else {
                // If the currents answer is not what is in the space, we should keep the char that is allready in that space. 
                guessedWord += org[i];
            }
        }

        if (isCorrect == false) {
            wrongGuesses.push(answer);
        } else if (guessedWord == correctWord) {
            isGameOver = true;
            wasGuessCorrect = true;
        } 
        for (let i = 0; i < wrongGuesses.length; i++) {
            
        }
    }

    // Read as "Has the player made to many wrong guesses". 
    // This works because we cant have more wrong guesses then we have drawings. 
    if (wrongGuesses.length == HANGMAN_UI.length) {
        isGameOver = true;
    }

}

// OUR GAME HAS ENDED.
console.log(ANSI.CLEAR_SCREEN);
console.log(drawWordDisplay());
console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
console.log(HANGMAN_UI[wrongGuesses.length]);

if (wasGuessCorrect) {
    console.log(ANSI.COLOR.YELLOW + "Congratulation, winer winner chicken dinner");
}
console.log("Game Over");
console.log("The word was " + correctWord);
process.exit();

function ifPlayerGuessedLetter(answer) {
    return answer.length == 1;
}


// answer = a
// correctWord = Catalana