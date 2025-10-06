const choices = document.querySelectorAll(".choice");
const userChoiceDisplay = document.getElementById("user-choice");
const computerChoiceDisplay = document.getElementById("computer-choice");
const winnerDisplay = document.getElementById("winner");
const resetBtn = document.getElementById("reset-btn");

let userChoice;
let computerChoice;

choices.forEach(choice => {
  choice.addEventListener("click", () => {
    userChoice = choice.id;
    computerChoice = getComputerChoice();
    displayChoices();
    determineWinner();
  });
});

function getComputerChoice() {
  const options = ["rock", "paper", "scissors"];
  const randomIndex = Math.floor(Math.random() * 3);
  return options[randomIndex];
}

function displayChoices() {
  userChoiceDisplay.textContent = `You chose: ${capitalize(userChoice)}`;
  computerChoiceDisplay.textContent = `Computer chose: ${capitalize(computerChoice)}`;
}

function determineWinner() {
  if (userChoice === computerChoice) {
    winnerDisplay.textContent = "Result: It's a Draw! 🤝";
    return;
  }

  if (
    (userChoice === "rock" && computerChoice === "scissors") ||
    (userChoice === "paper" && computerChoice === "rock") ||
    (userChoice === "scissors" && computerChoice === "paper")
  ) {
    winnerDisplay.textContent = "Result: You Win! 🎉";
  } else {
    winnerDisplay.textContent = "Result: Computer Wins! 💻";
  }
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

resetBtn.addEventListener("click", () => {
  userChoiceDisplay.textContent = "You chose: -";
  computerChoiceDisplay.textContent = "Computer chose: -";
  winnerDisplay.textContent = "Result: -";
});
