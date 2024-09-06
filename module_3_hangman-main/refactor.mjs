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
import { TEXT } from './text.mjs';

let loopGame = true;
let totalWrongGuesses = 0;
let totalWordsGuessed = 0;
let roundsPlayed = 0;

while (loopGame) {
    const collectWordsFromTxt = readFileSync('./words.txt').toString('utf8').split("\r\n");
    const correctWord = collectWordsFromTxt[Math.floor(Math.random()*collectWordsFromTxt.length)].toLowerCase();
    const numberOfCharInWord = correctWord.length;
    let guessedWord = "".padStart(correctWord.length, "_"); // "" is an empty string that we then fill with _ based on the number of char in the correct word.
    let wordDisplay = "";
    let isGameOver = false;
    let wasGuessCorrect = false;
    let wrongGuesses = [];

    function drawWordDisplay() {

        wordDisplay = "";

        for (let i = 0; i < numberOfCharInWord; i++) {
            if (guessedWord[i] != "_") {
                wordDisplay += ANSI.COLOR.GREEN;
            }
            wordDisplay = wordDisplay + guessedWord[i] + " ";
            wordDisplay += ANSI.RESET;
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

    while (isGameOver == false) {

        console.log(ANSI.CLEAR_SCREEN);
        console.log(drawWordDisplay());
        console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
        console.log(HANGMAN_UI[wrongGuesses.length]);

        const answer = (await askQuestion(TEXT.GUESSLETTER)).toLowerCase();

        if (answer == correctWord) {
            totalWordsGuessed++;
            isGameOver = true;
            wasGuessCorrect = true;     
        } else if (PlayerGuesses(answer)) {
            let org = guessedWord;
            guessedWord = "";

            let isCorrect = false;
            for (let i = 0; i < correctWord.length; i++) {
                if (correctWord[i] == answer) {
                    guessedWord += answer;
                    isCorrect = true;
                } else { 
                    guessedWord += org[i];
                }
            }
            if (isCorrect == false) {
                if (wrongGuesses.includes(answer) == false) {
                    wrongGuesses.push(answer);
                    totalWrongGuesses++;
                } else {
                    wrongGuesses.push("");
                    totalWrongGuesses++;
                }
            } else if (guessedWord == correctWord) {
                isGameOver = true;
                wasGuessCorrect = true;
            } 
        }

        if (wrongGuesses.length == HANGMAN_UI.length - 1) {
            roundsPlayed++;
            isGameOver = true;
        }
    }

    console.log(ANSI.CLEAR_SCREEN);
    console.log(drawWordDisplay());
    console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
    console.log(HANGMAN_UI[wrongGuesses.length]);

    if (wasGuessCorrect) {
        console.log(ANSI.COLOR.YELLOW + TEXT.YOUWON + ANSI.RESET);
    }
    console.log(TEXT.GAMEOVER);
    console.log(TEXT.THEWORDWAS + correctWord);
    
    function PlayerGuesses(answer) {
        return answer.length;
    }

    const playAgain = (await askQuestion(TEXT.PLAYONEMORETIME)).toLowerCase();
    if (playAgain == "1") {
        loopGame = true;
    } else {
        loopGame = false;
    }
}
console.log(ANSI.CLEAR_SCREEN);
console.log(TEXT.THANKYOU4PLAYING);
console.log(TEXT.TOTALWRONGGUESSES + ANSI.COLOR.RED + totalWrongGuesses + ANSI.RESET);
console.log(TEXT.TOTALWORDSGUESSED + ANSI.COLOR.GREEN + totalWordsGuessed + ANSI.RESET);
console.log(TEXT.ROUNDSPLAYED + ANSI.COLOR.YELLOW + roundsPlayed + ANSI.RESET);

const exitProgram = (await askQuestion(TEXT.EXITTHEPROGRAM)).toLowerCase();
if (exitProgram == exitProgram) {
    console.log(ANSI.CLEAR_SCREEN);
    process.exit();
}