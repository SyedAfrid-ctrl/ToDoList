const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");
const congratsMessage = document.getElementById("congrats-message");

// Load tasks when page loads
document.addEventListener("DOMContentLoaded", loadTasks);

// Add task when pressing Enter
inputBox.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Updates the completed and uncompleted task counters
function updateCounters() {
  const totalTasks = listContainer.getElementsByTagName("li").length;
  const completedTasks = listContainer.querySelectorAll(".completed").length;
  completedCounter.textContent = completedTasks;
  uncompletedCounter.textContent = totalTasks - completedTasks;

  // Show the congratulatory message if all tasks are complete
  congratsMessage.style.display = totalTasks > 0 && completedTasks === totalTasks ? "block" : "none";
}

// Saves tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#list-container li").forEach(li => {
    tasks.push({
      text: li.querySelector(".task-text").textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Loads tasks from localStorage
function loadTasks() {
  listContainer.innerHTML = "";
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  storedTasks.forEach(task => {
    createTaskElement(task.text, task.completed);
  });
  updateCounters();
}

// Creates a task element and appends it to the list
function createTaskElement(task, completed = false) {
  const li = document.createElement("li");
  li.innerHTML = `
    <div class="task-content">
      <input type="checkbox" class="task-checkbox" ${completed ? "checked" : ""}>
      <span class="task-text">${task}</span>
    </div>
    <div class="task-actions">
      <button class="edit-btn" ${completed ? "disabled" : ""}>✏️</button>
      <button class="delete-btn">❌</button>
    </div>
  `;

  if (completed) li.classList.add("completed");

  listContainer.appendChild(li);
  updateCounters();

  const checkbox = li.querySelector(".task-checkbox");
  const taskText = li.querySelector(".task-text");
  const editBtn = li.querySelector(".edit-btn");

  // Toggle completion on clicking the task (excluding buttons)
  li.addEventListener("click", (event) => {
    if (!event.target.classList.contains("edit-btn") && !event.target.classList.contains("delete-btn")) {
      checkbox.checked = !checkbox.checked;
      li.classList.toggle("completed", checkbox.checked);
      editBtn.disabled = checkbox.checked; // Disable edit button when task is completed
      updateCounters();
      saveTasks();
    }
  });

  // Delete button functionality
  li.querySelector(".delete-btn").addEventListener("click", (event) => {
    event.stopPropagation();
    li.remove();
    updateCounters();
    saveTasks();
  });

  // Edit button functionality (only works if task is not completed)
  editBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!li.classList.contains("completed")) {
      const span = li.querySelector(".task-text");
      span.contentEditable = true;
      span.focus();
      span.addEventListener("blur", validateAndSave);
      span.addEventListener("keypress", function (event) {
        if (event.key === "Enter") validateAndSave();
      });

      function validateAndSave() {
        if (!span.textContent.trim()) {
          alert("Task cannot be empty!");
          span.textContent = task;
        }
        span.contentEditable = false;
        saveTasks();
      }
    }
  });

  saveTasks();
}

// Adds a new task
function addTask() {
  const task = inputBox.value.trim();
  if (!task) {
    alert("Please write down a task!");
    return;
  }
  createTaskElement(task);
  inputBox.value = "";
}
