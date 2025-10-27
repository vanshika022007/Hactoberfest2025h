const wordDisplay = document.getElementById("word-display");
const wordInput = document.getElementById("word-input");
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("start-btn");
const difficultySelect = document.getElementById("difficulty");
const wordsPerMinuteEl = document.getElementById("wpm");

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
let totalTime = 30;

// Error handling for DOM elements
if (!wordDisplay || !wordInput || !timeEl || !scoreEl || !startBtn) {
  console.error("Essential DOM elements not found!");
}

function getRandomWord() {
  return animeWords[Math.floor(Math.random() * animeWords.length)];
}

function showWord() {
  currentWord = getRandomWord();
  wordDisplay.textContent = currentWord;
  // Add visual feedback
  wordDisplay.style.transform = "scale(1.1)";
  setTimeout(() => {
    wordDisplay.style.transform = "scale(1)";
  }, 200);
}

function startGame() {
  // Reset game state
  score = 0;
  
  // Set initial time based on difficulty
  const difficulty = difficultySelect?.value || "medium";
  switch(difficulty) {
    case "easy":
      time = 45;
      break;
    case "medium":
      time = 30;
      break;
    case "hard":
      time = 20;
      break;
    default:
      time = 30;
  }
  
  totalTime = time;
  gameActive = true;
  
  // UI updates
  if (wordInput) wordInput.disabled = false;
  if (startBtn) startBtn.disabled = true;
  if (difficultySelect) difficultySelect.disabled = true;
  if (wordInput) wordInput.value = "";
  if (wordInput) wordInput.focus();
  if (scoreEl) scoreEl.textContent = score;
  if (timeEl) timeEl.textContent = time;
  if (wordsPerMinuteEl) wordsPerMinuteEl.textContent = "0";
  
  showWord();
  
  // Start timer
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(updateTime, 1000);
}

function updateTime() {
  if (!gameActive) return;
  
  time--;
  if (timeEl) timeEl.textContent = time;
  
  // Visual warning when time is running out
  if (time <= 5 && time > 0) {
    timeEl.style.color = "#ff4444";
    timeEl.style.animation = "pulse 0.5s infinite";
  }
  
  if (time <= 0) {
    endGame();
  }
}

function endGame() {
  if (timerInterval) clearInterval(timerInterval);
  gameActive = false;
  
  // Calculate WPM
  const wpm = Math.round((score / totalTime) * 60);
  
  // Update UI
  if (wordDisplay) wordDisplay.textContent = "✨ Game Over! ✨";
  if (startBtn) startBtn.disabled = false;
  if (difficultySelect) difficultySelect.disabled = false;
  if (wordInput) wordInput.disabled = true;
  if (timeEl) {
    timeEl.style.color = "";
    timeEl.style.animation = "";
  }
  
  // Show final score
  if (wordsPerMinuteEl) {
    wordsPerMinuteEl.textContent = wpm;
  }
  
  // Console log for debugging
  console.log(`Game ended! Score: ${score}, WPM: ${wpm}`);
}

// Handle input
if (wordInput) {
  wordInput.addEventListener("input", () => {
    if (!gameActive) return;
    
    if (wordInput.value.trim().toLowerCase() === currentWord.toLowerCase()) {
      score++;
      if (scoreEl) scoreEl.textContent = score;
      showWord();
      wordInput.value = "";
      
      // Update WPM dynamically
      const elapsedTime = totalTime - time;
      const wpm = elapsedTime > 0 ? Math.round((score / elapsedTime) * 60) : 0;
      if (wordsPerMinuteEl) wordsPerMinuteEl.textContent = wpm;
    }
  });
  
  // Prevent Enter key from submitting
  wordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  });
}

// Handle start button
if (startBtn) {
  startBtn.addEventListener("click", startGame);
}

// Add pulse animation for low time warning
const style = document.createElement("style");
style.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;
document.head.appendChild(style);
