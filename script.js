let tasks = []  

const containerTasks = document.querySelector(".tasks");
const btnAddTask = document.getElementById("add");

btnAddTask.addEventListener('click', addTask);

document.addEventListener("DOMContentLoaded", () => {
  getfromLocalStorage();
  if(tasks.length === 0) {
    loadfromjson();
  }
});


function loadfromjson() {
  fetch("tasks.json")
    .then(response => response.json())
    .then(values => {
      tasks = values;  
      loadTasks();
    })
    .catch(error => console.log(error));
}

function loadTasks() {
  containerTasks.innerHTML = "";
  tasks.forEach((task, index) => {
    const div = document.createElement('div');
    div.dataset.index = index;  
    
    const inputElement = document.createElement('input');
    inputElement.type = "checkbox";
    inputElement.checked = task.completed; 

    const spanTag = document.createElement('span');
    spanTag.textContent = task.task;

    const btnDelete = document.createElement('button');
    btnDelete.id = "delete";
    btnDelete.textContent = "Delete Task";

    if (task.completed) {
      spanTag.style.textDecoration = "line-through";
      inputElement.disabled = true;
      spanTag.style.opacity = 0.4;
    }

    div.classList.add("task");

    div.appendChild(inputElement);
    div.appendChild(spanTag);
    div.appendChild(btnDelete);

    btnDelete.addEventListener('click', removeTask);
    inputElement.addEventListener('click', () => complete(inputElement));

    containerTasks.appendChild(div);
  });

  saveToLocal();  
}

function addTask() {
  const taskInput = document.getElementById("task-to-add");
  const task = taskInput.value.trim();
  if (!task) return;

  const currentDate = new Date();
  const added_on = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

  tasks.push({
    task: task,
    date: added_on,
    completed: false
  });

  taskInput.value = ""; 
  loadTasks();
}

function complete(checkbox) {
  const divClicked = checkbox.closest('.task');
  const spanElement = divClicked.querySelector('span');
  const index = divClicked.dataset.index;

  if (checkbox.checked) {
    spanElement.style.textDecoration = "line-through";
    spanElement.style.opacity = 0.4;
    tasks[index].completed = true;
    checkbox.disabled = true; 
  } else {
    spanElement.style.textDecoration = "none";
    spanElement.style.opacity = 1;
    tasks[index].completed = false;
  }

  saveToLocal();
}

function removeTask() {
  const taskDiv = this.closest(".task");
  const taskIndex = taskDiv.dataset.index;

  tasks.splice(taskIndex, 1);

  loadTasks();
}

function saveToLocal() {
  localStorage.setItem("tasks", JSON.stringify(tasks)); 
}

function getfromLocalStorage() {
  const data = localStorage.getItem("tasks");
  if (data) {
    tasks = JSON.parse(data); 
    loadTasks();
  }
}
