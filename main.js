let taskInput = document.getElementById('task');
let list = document.getElementById('tasks');
let listFinished = document.getElementById('finishTasks');
let btn = document.getElementById('btn')

getTasks();

list.addEventListener("click", taskChange);
listFinished.addEventListener("click", taskChange);
btn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function (e) {
    if (e.keyCode === 13) {
        addTask();
    }
})


//Get the task from the input form
function addTask() {
    //check if empty or it is only spaces
    if (taskInput.value === '' || taskInput.value.replace(/\s/g, "") == "") {
        alert("Please Write atask");
    } else {
        createTask(taskInput.value, list);
        saveStorage(taskInput.value, list.id);
        taskInput.value = '';
    }
}

//Create task
function createTask(task, listType) {

    const lable = document.createElement("label");
    const check = document.createElement("input");
    check.setAttribute("type", "checkbox");

    const span = document.createElement("span");
    span.className = "black-text";
    span.innerText = task;

    const deleteItem = document.createElement("a");
    deleteItem.setAttribute("href", "#");
    deleteItem.setAttribute("class", "deleteElement secondary-content");
    deleteItem.innerHTML = '<i class="material-icons red-text">close</i>';
    const listItem = document.createElement("li");

    //check if the task is finished
    if (listType === listFinished) {
        check.setAttribute("checked", "checked");
        check.classList = "filled-in"
        span.innerHTML = `<del>${task}</del>`;
        listItem.classList = "finishTasks collection-item"
    } else {
        listItem.classList = "tasks collection-item"
    }
    lable.appendChild(check);
    lable.appendChild(span);
    listItem.appendChild(lable);
    listItem.appendChild(deleteItem);
    listType.appendChild(listItem);
}

//task changes 
function taskChange(e) {

    // Remove task
    if (e.target.parentElement.classList.contains('deleteElement')) {

        taskRemove(e);

        // get the task type
        if (e.target.parentElement.parentElement.classList.contains('tasks')) {
            listType = "tasks";
        } else {
            listType = "finishTasks";
        }

        // Get the task text
        task = e.target.parentElement.previousElementSibling.lastElementChild.innerText;
        removeStorage(task, listType);
    }

    // task finished 
    if (e.target.checked && e.target.type === "checkbox") {
        taskRemove(e);
        removeStorage(e.target.nextElementSibling.innerText, "tasks");

        createTask(e.target.nextElementSibling.innerText, listFinished);
        saveStorage(e.target.nextElementSibling.innerText, listFinished.id);
    }
    // task unfinish
    if (!e.target.checked && e.target.type === "checkbox") {
        taskRemove(e);
        removeStorage(e.target.nextElementSibling.innerText, "finishTasks");


        createTask(e.target.nextElementSibling.innerText, list);
        saveStorage(e.target.nextElementSibling.innerText, list.id);
    }
}

//remove task 
function taskRemove(e) {
    e.target.parentElement.parentElement.remove();
}

// Save task to local storage
function saveStorage(task, listType) {
    let tasks = 'listType';
    if (localStorage.getItem(listType) === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem(listType));
    }
    tasks.push(task);
    localStorage.setItem(listType, JSON.stringify(tasks));
}

//remove task from local storage
function removeStorage(taskSaved, listType) {
    let tasks;
    tasks = JSON.parse(localStorage.getItem(listType));
    tasks.forEach(function (task, index) {
        if (taskSaved === task) {
            tasks.splice(index, 1);
        }
    });
    localStorage.setItem(listType, JSON.stringify(tasks));
}

// Get Tasks from LS
function getTasks() {
    // let tasks;
    if (localStorage.getItem('tasks') !== null &&
        JSON.parse(localStorage.getItem('tasks')).length !== 0) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks.forEach(function (task) {
            createTask(task, list);
        });
    }
    if (localStorage.getItem('finishTasks') !== null &&
        JSON.parse(localStorage.getItem('finishTasks')).length !== 0) {
        tasks = JSON.parse(localStorage.getItem('finishTasks'));
        tasks.forEach(function (task) {
            createTask(task, listFinished);
        });
    }
}