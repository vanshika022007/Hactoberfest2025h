// Tic-Tac-Toe - simple local two-player game
const X_CLASS = 'x'
const O_CLASS = 'o'
const WIN_COMBINATIONS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
]

const boardEl = document.getElementById('board')
const cells = Array.from(document.querySelectorAll('.cell'))
const messageEl = document.getElementById('message')
const restartBtn = document.getElementById('restartBtn')
const scoreXEl = document.getElementById('scoreX')
const scoreOEl = document.getElementById('scoreO')

let xTurn = true
let board = Array(9).fill(null)
let running = true
let score = { X: 0, O: 0 }

function startGame(){
  board.fill(null)
  running = true
  xTurn = true
  messageEl.textContent = "Player X's turn"
  cells.forEach((cell, idx) => {
    cell.classList.remove(X_CLASS, O_CLASS, 'win')
    cell.disabled = false
    cell.textContent = ''
    cell.addEventListener('click', onCellClick)
  })
}

function onCellClick(e){
  const cell = e.currentTarget
  const idx = Number(cell.dataset.index)
  if(!running || board[idx] !== null) return
  const mark = xTurn ? X_CLASS : O_CLASS
  placeMark(cell, idx, mark)
  if(checkWin(mark)){
    endGame(false, mark)
  } else if(isDraw()){
    endGame(true)
  } else {
    xTurn = !xTurn
    messageEl.textContent = `Player ${xTurn ? 'X' : 'O'}'s turn`
  }
}

function placeMark(cell, idx, mark){
  board[idx] = mark === X_CLASS ? 'X' : 'O'
  cell.classList.add(mark)
  cell.textContent = mark === X_CLASS ? 'X' : 'O'
}

function checkWin(mark){
  const player = mark === X_CLASS ? 'X' : 'O'
  return WIN_COMBINATIONS.some(combo => {
    if(combo.every(i => board[i] === player)){
      // highlight win cells
      combo.forEach(i => cells[i].classList.add('win'))
      return true
    }
    return false
  })
}

function isDraw(){
  return board.every(cell => cell !== null)
}

function endGame(draw, winnerMark){
  running = false
  if(draw){
    messageEl.textContent = "It's a draw!"
  } else {
    const winner = winnerMark === X_CLASS ? 'X' : 'O'
    messageEl.textContent = `Player ${winner} wins!`
    // update score
    if(winner === 'X') score.X++
    else score.O++
    updateScoreUI()
  }
  // disable remaining cells
  cells.forEach(c => c.disabled = true)
}

function updateScoreUI(){
  scoreXEl.textContent = String(score.X)
  scoreOEl.textContent = String(score.O)
}

restartBtn.addEventListener('click', () => {
  startGame()
})

// initialize
startGame()
