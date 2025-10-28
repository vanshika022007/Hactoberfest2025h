const addBtn = document.getElementById("add-btn");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// Load tasks from localStorage
document.addEventListener("DOMContentLoaded", loadTasks);

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const li = document.createElement("li");
  li.className = "task-item";
  li.innerHTML = `
    <span>${taskText}</span>
    <button class="delete-btn">×</button>
  `;

  li.addEventListener("click", toggleTask);
  li.querySelector(".delete-btn").addEventListener("click", deleteTask);

  taskList.appendChild(li);
  saveTasks();
  taskInput.value = "";
}

function toggleTask(e) {
  if (e.target.tagName !== "BUTTON") {
    this.classList.toggle("completed");
    saveTasks();
  }
}

function deleteTask(e) {
  e.stopPropagation();
  this.parentElement.remove();
  saveTasks();
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll(".task-item").forEach((item) => {
    tasks.push({
      text: item.querySelector("span").textContent,
      completed: item.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks") || "[]");
  saved.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) li.classList.add("completed");
    li.innerHTML = `
      <span>${task.text}</span>
      <button class="delete-btn">×</button>
    `;
    li.addEventListener("click", toggleTask);
    li.querySelector(".delete-btn").addEventListener("click", deleteTask);
    taskList.appendChild(li);
  });
}
