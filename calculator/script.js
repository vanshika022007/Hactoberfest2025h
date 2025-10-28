// New simple calculator logic supporting + - * / mod, square and cube

const displayEl = document.getElementById('display');
const keys = document.querySelector('.keys');

let current = '0';
let previous = null;
let operator = null;
let waitingForNew = false;

function updateDisplay() {
  displayEl.textContent = current;
}

function inputDigit(d) {
  if (waitingForNew) {
    current = d === '.' ? '0.' : d;
    waitingForNew = false;
  } else {
    if (d === '.' && current.includes('.')) return;
    current = current === '0' && d !== '.' ? d : current + d;
  }
  updateDisplay();
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  waitingForNew = false;
  updateDisplay();
}

function backspace() {
  if (waitingForNew) return;
  if (current.length <= 1) current = '0';
  else current = current.slice(0, -1);
  updateDisplay();
}

function applyUnary(name) {
  const x = parseFloat(current);
  if (Number.isNaN(x)) return;
  let res;
  if (name === 'square') res = x * x;
  else if (name === 'cube') res = x * x * x;
  else return;
  current = String(res);
  waitingForNew = true;
  updateDisplay();
}

function handleOperator(nextOp) {
  const inputValue = parseFloat(current);
  if (operator && waitingForNew) {
    operator = nextOp;
    return;
  }

  if (previous == null && !Number.isNaN(inputValue)) {
    previous = inputValue;
  } else if (operator) {
    const result = compute(previous, inputValue, operator);
    current = String(result);
    previous = result === 'Error' ? null : result;
  }

  operator = nextOp;
  waitingForNew = true;
  updateDisplay();
}

function compute(a, b, op) {
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === '*') return a * b;
  if (op === '/') return b === 0 ? 'Error' : a / b;
  if (op === 'mod') return b === 0 ? 'Error' : a % b;
  return b;
}

function handleEquals() {
  const inputValue = parseFloat(current);
  if (operator == null || previous == null) return;
  const result = compute(previous, inputValue, operator);
  current = String(result);
  previous = null;
  operator = null;
  waitingForNew = true;
  updateDisplay();
}

keys.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  if (btn.hasAttribute('data-digit')) {
    inputDigit(btn.getAttribute('data-digit'));
    return;
  }

  if (btn.hasAttribute('data-op')) {
    handleOperator(btn.getAttribute('data-op'));
    return;
  }

  if (btn.dataset.action === 'clear') { clearAll(); return; }
  if (btn.dataset.action === 'back') { backspace(); return; }
  if (btn.dataset.action === 'equals') { handleEquals(); return; }
  if (btn.dataset.fn) { applyUnary(btn.dataset.fn); return; }
});

// keyboard support
window.addEventListener('keydown', (e) => {
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') { inputDigit(e.key); e.preventDefault(); return; }
  if (e.key === 'Enter' || e.key === '=') { handleEquals(); e.preventDefault(); return; }
  if (e.key === 'Backspace') { backspace(); return; }
  if (e.key === 'Escape') { clearAll(); return; }
  if (e.key === '+') { handleOperator('+'); return; }
  if (e.key === '-') { handleOperator('-'); return; }
  if (e.key === '*' || e.key === 'x') { handleOperator('*'); return; }
  if (e.key === '/') { handleOperator('/'); return; }
  if (e.key === '%') { handleOperator('mod'); return; }
});

// also handle fn buttons that may be outside the main .keys (e.g. footer cube button)
document.querySelector('.calculator').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  if (btn.closest('.keys')) return; // keys are handled by the keys listener
  if (btn.dataset.fn) { applyUnary(btn.dataset.fn); return; }
  if (btn.dataset.action === 'clear') { clearAll(); return; }
  if (btn.dataset.action === 'back') { backspace(); return; }
  if (btn.dataset.action === 'equals') { handleEquals(); return; }
  if (btn.hasAttribute('data-op')) { handleOperator(btn.getAttribute('data-op')); return; }
  if (btn.hasAttribute('data-digit')) { inputDigit(btn.getAttribute('data-digit')); return; }
});

// initialize
clearAll();
