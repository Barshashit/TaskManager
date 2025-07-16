// Selectors

const dateInput = document.querySelector('.date-input');
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');
const sunsetTheme = document.querySelector('.sunset-theme');


document.addEventListener("DOMContentLoaded", () => {
    const reminderBell = document.querySelector(".reminder-bell");
    const reminderBox = document.getElementById("reminder-box");

    reminderBell.addEventListener("click", () => {
        reminderBox.style.display = reminderBox.style.display === "block" ? "none" : "block";
    });
});


// Event Listeners

toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));
sunsetTheme.addEventListener('click', () => changeTheme('sunset'));


// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ?
    changeTheme('sunset')
    : changeTheme(localStorage.getItem('savedTheme'));

// Functions;
function addToDo(event) {
    // Prevents form from submitting / Prevents form from relaoding;
    event.preventDefault();

    // toDo DIV;
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);

    // Create LI
    const newToDo = document.createElement('li');
    if (toDoInput.value === '') {
            alert("You must write something!");
        } 
    else {
        // newToDo.innerText = "hey";
        newToDo.innerText = toDoInput.value;
        newToDo.setAttribute('contenteditable', 'true');
        newToDo.dataset.originalText = toDoInput.value;
        newToDo.addEventListener('blur', () => updateEditedTodo(newToDo.innerText, newToDo.dataset.originalText));

        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        const dueDateSpan = document.createElement('span');
        dueDateSpan.classList.add('due-date');
        dueDateSpan.innerText = dateInput.value ? `Due: ${dateInput.value}` : '';
        toDoDiv.appendChild(dueDateSpan);


        // Adding to local storage;
        savelocal({
            text: toDoInput.value,
            dueDate: dateInput.value
        });

        addReminderToUI({
            text: toDoInput.value,
            dueDate: dateInput.value
        });


        // check btn;
        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add('check-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(checked);
        // delete btn;
        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add('delete-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        // Append to list;
        toDoList.appendChild(toDoDiv);
        updateProgressBar();
        
        // CLearing the input;
        toDoInput.value = '';
    }

}   



function deletecheck(event){

    // console.log(event.target);
    const item = event.target;

    // delete
    if(item.classList[0] === 'delete-btn')
    {
        // item.parentElement.remove();
        // animation
        item.parentElement.classList.add("fall");

        //removing local todos;
        removeLocalTodos(item.parentElement);

        item.parentElement.addEventListener('transitionend', function(){
            item.parentElement.remove();
            updateProgressBar();
        })
    }
    if (item.classList[0] === 'check-btn') {
        item.parentElement.classList.toggle("completed");
        updateProgressBar(); // Update immediately after checking/unchecking
    }
}


// Saving to local storage:
function savelocal(todo){
    //Check: if item/s are there;
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}



function getTodos() {
    //Check: if item/s are there;
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.forEach(function(todo) { 

        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo", `${savedTheme}-todo`);

        const newToDo = document.createElement('li');
        newToDo.innerText = todo.text; 
        newToDo.setAttribute('contenteditable', 'true');
        newToDo.dataset.originalText = todo.text;
        newToDo.addEventListener('blur', () => updateEditedTodo(newToDo.innerText, newToDo.dataset.originalText));
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        const dueDateSpan = document.createElement('span');
        dueDateSpan.classList.add('due-date');
        dueDateSpan.innerText = todo.dueDate ? `Due: ${todo.dueDate}` : '';
        toDoDiv.appendChild(dueDateSpan);

        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add("check-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(checked);

        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add("delete-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        toDoList.appendChild(toDoDiv);
        if (todo.dueDate) {
            addReminderToUI(todo);
        }
    });
    updateProgressBar();
}



function removeLocalTodos(todo){
    //Check: if item/s are there;
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    const todoIndex =  todos.indexOf(todo.children[0].innerText);
    // console.log(todoIndex);
    todos.splice(todoIndex, 1);
    // console.log(todos);
    localStorage.setItem('todos', JSON.stringify(todos));
}



// Change theme function:
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;
    // Change blinking cursor for darker theme:
    color === 'darker' ? 
        document.getElementById('title').classList.add('darker-title')
        : document.getElementById('title').classList.remove('darker-title');

    document.querySelector('input').className = `${color}-input`;
    document.querySelector('.date-input').className = `${color}-input date-input`;

    // Change todo color without changing their status (completed or not):
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ? 
            todo.className = `todo ${color}-todo completed`
            : todo.className = `todo ${color}-todo`;
    });
    // Change buttons color according to their type (todo, check or delete):
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
              button.className = `check-btn ${color}-button`;  
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`; 
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            }
        });
    });
    updateProgressBar();
}

function updateEditedTodo(newText, oldText) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    const index = todos.indexOf(oldText);
    if (index !== -1) {
        todos[index] = newText;
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

function addReminderToUI(taskData) {
    if (!taskData.dueDate) return; // Only show tasks with dates
    const li = document.createElement("li");
    li.textContent = `${taskData.text} — Due: ${taskData.dueDate}`;
    document.getElementById("reminder-list").appendChild(li);
}

function updateProgressBar() {
    const todos = Array.from(document.querySelectorAll('.todo-list .todo'));
    const completed = todos.filter(todo => todo.classList.contains('completed'));

    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    const total = todos.length;
    const done = completed.length;

    let percentage = total === 0 ? 0 : Math.round((done / total) * 100);

    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${done} / ${total} Tasks Completed`;
}
