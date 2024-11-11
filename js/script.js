const todoForm = document.querySelector('form');
const todoInput = todoForm.querySelector('input');
const filter = document.querySelector('#filter');
const todoList = document.querySelector('ul');
const todos = todoList.querySelectorAll('li');
const formBtn = todoForm.querySelector('button');
const clearBtn = document.getElementById('clear-btn');
let isEdit = false;

//displaytasksfromstorage
function displayTasks() {
  let tasksFromstorage = getTasksFromStorage();

  tasksFromstorage.forEach((task) => addTaskToDom(task));

  checkUi();
}

//Function addTodo
function onAddTask(e) {
  e.preventDefault();

  const newTask = todoInput.value.trim();

  if (newTask === '') {
    alert('Please add a Task');
    return;
  }

  if (isEdit) {
    const taskToEdit = todoList.querySelector('.edit-mode');

    removeFromStorage(taskToEdit.textContent.trim());
    taskToEdit.classList.remove('edit-mode');
    taskToEdit.remove();

    isEdit = true;
  }

  if (isTaskExisting(newTask)) {
    alert('This is an existing task!');
    todoInput.value = ''
    return;
  }

  //Add New task to the DOM
  addTaskToDom(newTask);

  //add task to localStorage
  addTaskToStorage(newTask);

  todoInput.value = '';

  checkUi();
}

//Check for existing tasks
function isTaskExisting(item) {
  let tasksFromstorage = getTasksFromStorage();
  return tasksFromstorage.includes(item);
}

function addTaskToDom(task) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(task));

  const button = createButton('remove-text style-text')
  li.appendChild(button);

  //add new todo to the DOM
  todoList.appendChild(li);
}

//gettasksfromstorage
function getTasksFromStorage() {
  let tasksFromstorage;

  if (localStorage.getItem('tasks') === null) {
    tasksFromstorage = [];
  }
  else {
    tasksFromstorage = JSON.parse(localStorage.getItem('tasks'));
  }

  return tasksFromstorage;
}

//add task to localStorage
function addTaskToStorage(task) {
  const tasksFromstorage = getTasksFromStorage();

  //Push new item to tasksfromstorage
  tasksFromstorage.push(task);

  //Convert and re-set to storage
  localStorage.setItem('tasks', JSON.stringify(tasksFromstorage));
}

function onClickTask(e) {
  if (e.target.parentElement.parentElement.classList.contains('remove-text')) {
    removeTask(e.target.parentElement.parentElement.parentElement);
  } else {
    setTaskToEdit(e.target);
  }

}

//SetTaskToEdit
function setTaskToEdit(task) {
  isEdit = true;

  const todos = todoList.querySelectorAll('li');

  todos.forEach(t => t.classList.remove('edit-mode'));

  task.classList.add('edit-mode');

  todoInput.value = task.textContent.trim();
  formBtn.style.backgroundColor = '#228b22';
  formBtn.style.width = '8.5em';
  formBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 19h9" />
  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
</svg> Update Task`
}

//removeTodo function
function removeTask(task) {
  if (confirm('Are you sure?')) {
    //remove task from the DOM
    task.remove();

    //remove task from storage
    removeFromStorage(task.textContent.trim());

    checkUi();
  }
}

//removefromstorage
function removeFromStorage(task) {
  let tasksFromstorage = getTasksFromStorage();

  tasksFromstorage = tasksFromstorage.filter(t => t !== task);

  //re-set to storage
  localStorage.setItem('tasks', JSON.stringify(tasksFromstorage));

  checkUi();
}

//clearTask function
function clearTasks() {
  todoList.innerHTML = '';

  //clear from local storage
  localStorage.removeItem('tasks');

  checkUi();
}

//Filter
function filterTasks(e) {
  const todos = todoList.querySelectorAll('li');
  const text = filter.value.toLowerCase();

  todos.forEach((task) => {
    const taskText = task.firstChild.textContent.toLowerCase();
    if (taskText.indexOf(text) !== -1) {
      task.style.display = 'flex';
    } else {
      task.style.display = 'none';
    }
  })

}

//Createbutton function
function createButton(classes) {
  const button = document.createElement('button');
  button.classList = classes;
  const icon = createIcon();
  button.appendChild(icon);

  return button;
}

//createIcon Function
function createIcon() {
  const icon = document.createElement('i');
  icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18" />
  <line x1="6" y1="6" x2="18" y2="18" />
</svg>`
  return icon;
}

//checking ui
function checkUi() {
  todoInput.value = '';

  const todos = todoList.querySelectorAll('li');

  if (todos.length === 0) {
    filter.style.display = 'none';
    clearBtn.style.display = 'none';
  }
  else {
    filter.style.display = 'block';
    clearBtn.style.display = 'block';
  }

  formBtn.style.backgroundColor = '#000';
  formBtn.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="12" y1="5" x2="12" y2="19" />
  <line x1="5" y1="12" x2="19" y2="12" />
</svg> Add Task`

  isEdit = false;
}

//Event Listeners
todoForm.addEventListener('submit', onAddTask);
todoList.addEventListener('click', onClickTask);
clearBtn.addEventListener('click', clearTasks);
window.addEventListener('DOMContentLoaded', displayTasks);
filter.addEventListener('input', filterTasks)

checkUi();
