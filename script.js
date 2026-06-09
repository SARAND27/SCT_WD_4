let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

addBtn.addEventListener("click", addTask);

function addTask() {

    const taskText = taskInput.value.trim();
    const date = taskDate.value;
    const time = taskTime.value;

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        date: date,
        time: time,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
}

function formatTime(time) {

    if (!time) return "No Time";

    let [hours, minutes] = time.split(":");

    hours = parseInt(hours);

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${hours}:${minutes} ${ampm}`;
}

function renderTasks(filter = "all") {

    taskList.innerHTML = "";

    let filteredTasks = [...tasks];

    if (filter === "completed") {
        filteredTasks = filteredTasks.filter(task => task.completed);
    }

    if (filter === "pending") {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    filteredTasks.sort((a, b) => {
        return new Date(`${a.date} ${a.time}`) -
               new Date(`${b.date} ${b.time}`);
    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");
        li.classList.add("task-item");

        li.innerHTML = `
            <div class="task-details ${task.completed ? 'completed' : ''}">
                <h3>${task.text}</h3>
                <p>📅 ${task.date || "No Date"}</p>
                <p>🕒 ${formatTime(task.time)}</p>
            </div>

            <div class="task-buttons">

                <button class="complete-btn"
                        onclick="toggleComplete(${task.id})">
                    ✓
                </button>

                <button class="edit-btn"
                        onclick="editTask(${task.id})">
                    Edit
                </button>

                <button class="delete-btn"
                        onclick="deleteTask(${task.id})">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });

    updateStats();
}

function toggleComplete(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

function deleteTask(id) {

    if (!confirm("Delete this task?")) {
        return;
    }

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    const newText = prompt("Edit Task", task.text);

    if (newText !== null && newText.trim() !== "") {

        task.text = newText.trim();

        saveTasks();
        renderTasks();
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function filterTasks(type) {
    renderTasks(type);
}

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
}

renderTasks();