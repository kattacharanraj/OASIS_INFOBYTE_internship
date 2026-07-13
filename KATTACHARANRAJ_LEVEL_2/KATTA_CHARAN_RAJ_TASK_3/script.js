const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const pendingList = document.getElementById('pendingList');
const completedList = document.getElementById('completedList');
const noPending = document.getElementById('noPending');
const noCompleted = document.getElementById('noCompleted');

let tasks = JSON.parse(localStorage.getItem('tasks')) || {
    pending: [],
    completed: []
};

function formatDate(date) {
    const d = new Date(date);
    const dateStr = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const timeStr = d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    return `${dateStr} at ${timeStr}`;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    pendingList.innerHTML = '';
    completedList.innerHTML = '';

    tasks.pending.forEach((task, index) => {
        const li = createTaskElement(task, index, 'pending');
        pendingList.appendChild(li);
    });

    tasks.completed.forEach((task, index) => {
        const li = createTaskElement(task, index, 'completed');
        completedList.appendChild(li);
    });

    noPending.style.display = tasks.pending.length === 0 ? 'block' : 'none';
    noCompleted.style.display = tasks.completed.length === 0 ? 'block' : 'none';
}

function createTaskElement(task, index, type) {
    const li = document.createElement('li');
    li.className = 'task-item';

    const textDiv = document.createElement('div');
    textDiv.className = 'task-text';

    const taskSpan = document.createElement('span');
    taskSpan.textContent = task.text;

    const dateSpan = document.createElement('span');
    dateSpan.className = 'task-date';
    dateSpan.textContent = 'Added: ' + formatDate(task.addedDate);

    textDiv.appendChild(taskSpan);
    textDiv.appendChild(dateSpan);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-btn';
    toggleBtn.textContent = type === 'pending' ? 'Done' : 'Undo';
    toggleBtn.onclick = () => toggleTask(index, type);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTask(index, type);

    actionsDiv.appendChild(toggleBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(textDiv);
    li.appendChild(actionsDiv);

    return li;
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const newTask = {
        text: taskText,
        addedDate: new Date().toISOString()
    };

    tasks.pending.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
}

function toggleTask(index, type) {
    const fromList = type === 'pending' ? tasks.pending : tasks.completed;
    const toList = type === 'pending' ? tasks.completed : tasks.pending;
    toList.push(fromList[index]);
    fromList.splice(index, 1);
    saveTasks();
    renderTasks();
}

function deleteTask(index, type) {
    const list = type === 'pending' ? tasks.pending : tasks.completed;
    list.splice(index, 1);
    saveTasks();
    renderTasks();
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

renderTasks();
