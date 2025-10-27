const wordDisplay = document.getElementById("word-display");
const wordInput = document.getElementById("word-input");
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("start-btn");

const animeWords = [
  "Naruto", "Sasuke", "Sakura", "Itachi", "Goku",
  "Vegeta", "Luffy", "Zoro", "Tanjiro", "Nezuko",
  "Eren", "Levi", "Mikasa", "Gon", "Killua",
  "Gojo", "Megumi", "Yuji", "Shinobu", "Saitama"
];

let time = 30;
let score = 0;
let currentWord;
let timerInterval;
let gameActive = false;

function getRandomWord() {
  return animeWords[Math.floor(Math.random() * animeWords.length)];
}

function showWord() {
  currentWord = getRandomWord();
  wordDisplay.textContent = currentWord;
}

function startGame() {
  score = 0;
  time = 30;
  gameActive = true;
  wordInput.disabled = false;
  startBtn.disabled = true;
  wordInput.value = "";
  wordInput.focus();
  scoreEl.textContent = score;
  timeEl.textContent = time;
  showWord();

  timerInterval = setInterval(updateTime, 1000);
}

function updateTime() {
  time--;
  timeEl.textContent = time;
  if (time <= 0) endGame();
}

function endGame() {
  clearInterval(timerInterval);
  gameActive = false;
  wordDisplay.textContent = "✨ Game Over! ✨";
  startBtn.disabled = false;
  wordInput.disabled = true;
}

wordInput.addEventListener("input", () => {
  if (wordInput.value.trim().toLowerCase() === currentWord.toLowerCase()) {
    score++;
    scoreEl.textContent = score;
    showWord();
    wordInput.value = "";
  }
});

startBtn.addEventListener("click", startGame);
