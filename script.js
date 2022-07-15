const taskInput = document.querySelector('.task-input input')
const filters = document.querySelectorAll('.filters span')
const taskBox = document.querySelector('.task-box')
const clearAll = document.querySelector('.clear-btn')

let editID;
let isEditedTask = false
// Lay du lieu tu localstorage
let todos = JSON.parse(localStorage.getItem('todo-list'))

showTodo('all')

function showTodo(filter){
    let li = ''
    if(todos){
        todos.forEach(function(todo, id){
            // Neu du lieu trong todo la completed, update lai value
            let isCompleted = todo.status == "completed" ? "checked" : ""
            if(filter == todo.status || filter == "all") {
                li += `
                <li class="task">
                <label for="${id}">
                    <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                    <p class="${isCompleted}">${todo.name}</p>
                </label>
                <div class="settings">
                    <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                    <ul class="task-menu">
                        <li onclick="editTask(${id}, ${todo.name})"><i class="fa-solid fa-pen"></i>Edit</li>
                        <li onclick="deleteTask(${id})"><i class="fa-solid fa-trash"></i>Delete</li>
                    </ul>
                </div>
                </li>
            `
            }
        })
    }
    taskBox.innerHTML = li || `<span>You don't have any task here</span>`
}



taskInput.addEventListener('keydown', (e) => {
    let userTask = taskInput.value.trim()
    if(e.key == 'Enter' && userTask){
        if(!isEditedTask){
            if(!todos){
                // Neu todos chua co du lieu, tao todos la 1 mang rong
                todos = []
            }
            let taskInfo = {name: userTask, status: 'pending'}
            todos.push(taskInfo) // Day du lieu vao todos
        } else {
            isEditedTask = false
            todos[editID].name = userTask
        }
        taskInput.value = ''
        localStorage.setItem('todo-list', JSON.stringify(todos))
        showTodo(document.querySelector("span.active").id);
    }
})

function editTask (taskID, taskName){
    taskInput.value = taskName
    isEditedTask = true
    editID = taskID

}

function deleteTask(deleteId){
    todos.splice(deleteId, 1)
    localStorage.setItem('todo-list', JSON.stringify(todos))
    showTodo('all')
}

clearAll.addEventListener('click', () => {
    todos.splice(0,todos.length)
    localStorage.setItem('todo-list', JSON.stringify(todos))
    showTodo('all')
})

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('span.active').classList.remove('active')
        btn.classList.add('active')
        showTodo(btn.id)
    })
})

function showMenu(selectedTask){
    let taskMenu = selectedTask.parentElement.lastElementChild
    taskMenu.classList.add('show')
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    })
}

function updateStatus(selectedTask){
    // Lay ra dong chua ten task dang chon
    let taskName = selectedTask.parentElement.lastElementChild
    if(selectedTask.checked){
        taskName.classList.add('checked')
        // Update status cua task thanh completed
        todos[selectedTask.id].status = "completed"
    } else {
        taskName.classList.remove('checked')
        // Update status cua task thanh pending
        todos[selectedTask.id].status = "pending"
    }
    localStorage.setItem('todo-list', JSON.stringify(todos))
}
