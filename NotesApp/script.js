const noteInput = document.getElementById('note-input');
const addBtn = document.getElementById('add-btn');
const notesList = document.getElementById('notes-list');

const NOTES_KEY = 'mini-notes';

// Load notes on start
function loadNotes() {
  const notes = JSON.parse(localStorage.getItem(NOTES_KEY)) || [];
  notes.forEach(addNoteToList);
}

// Save notes to localStorage
function saveNotes() {
  const notes = [];
  document.querySelectorAll('#notes-list li').forEach(li => {
    notes.push(li.dataset.text);
  });
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

// Add note to UI
function addNoteToList(text) {
  const li = document.createElement('li');
  li.textContent = text;
  li.dataset.text = text;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => {
    li.remove();
    saveNotes();
  };

  li.appendChild(deleteBtn);
  notesList.appendChild(li);
}

// Add button click
addBtn.addEventListener('click', () => {
  const text = noteInput.value.trim();
  if (text) {
    addNoteToList(text);
    saveNotes();
    noteInput.value = '';
  }
});

// Allow Enter (without Shift) to add note
noteInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    addBtn.click();
  }
});

// Start the app
loadNotes();