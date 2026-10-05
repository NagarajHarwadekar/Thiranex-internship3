/* =========================================================
   TASKFLOW
   JavaScript Logic & State Management
   ========================================================= */


/* =========================================================
   1. DOM ELEMENTS
   ========================================================= */

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const taskList = document.getElementById("taskList");

const emptyState = document.getElementById("emptyState");

const emptyTitle = document.getElementById("emptyTitle");

const emptyText = document.getElementById("emptyText");

const formMessage = document.getElementById("formMessage");

const filterButtons =
    document.querySelectorAll(".filter-button");

const clearCompletedButton =
    document.getElementById("clearCompleted");

const totalTasksElement =
    document.getElementById("totalTasks");

const activeTasksElement =
    document.getElementById("activeTasks");

const completedTasksElement =
    document.getElementById("completedTasks");


/* Modal */

const editModal =
    document.getElementById("editModal");

const editForm =
    document.getElementById("editForm");

const editInput =
    document.getElementById("editInput");

const closeModalButton =
    document.getElementById("closeModal");

const cancelEditButton =
    document.getElementById("cancelEdit");


/* =========================================================
   2. APPLICATION STATE
   ========================================================= */


/*
    The tasks array is our application state.

    Every task has:

    {
        id: unique identifier,
        title: task text,
        completed: true/false,
        createdAt: creation date
    }
*/


let tasks = [];

let currentFilter = "all";

let editingTaskId = null;


/* =========================================================
   3. LOCAL STORAGE
   ========================================================= */


/*
    localStorage allows the browser to remember tasks
    even after the page is refreshed.
*/

const STORAGE_KEY = "taskflow_tasks";


/*
    Load tasks from localStorage.
*/

function loadTasks() {

    try {

        const savedTasks =
            localStorage.getItem(STORAGE_KEY);

        if (savedTasks) {

            tasks = JSON.parse(savedTasks);

        } else {

            tasks = [];

        }

    } catch (error) {

        console.error(
            "Unable to load tasks:",
            error
        );

        tasks = [];

    }

}


/*
    Save current state to localStorage.
*/

function saveTasks() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );

}


/* =========================================================
   4. CREATE
   ========================================================= */


/*
    Create a new task.
*/

function addTask(title) {

    const cleanTitle = title.trim();


    /*
        Do not create empty tasks.
    */

    if (!cleanTitle) {

        showMessage(
            "Please enter a task before adding it."
        );

        return;

    }


    /*
        Create a unique ID.

        Date.now() gives us a timestamp.
        Math.random() adds extra uniqueness.
    */

    const newTask = {

        id:
            Date.now().toString() +
            Math.random().toString(16).slice(2),

        title: cleanTitle,

        completed: false,

        createdAt: new Date().toISOString()

    };


    /*
        Add the new task to the beginning
        of the state array.
    */

    tasks.unshift(newTask);


    /*
        Save updated state.
    */

    saveTasks();


    /*
        Refresh the UI.
    */

    render();


    /*
        Clear input.
    */

    taskInput.value = "";

    taskInput.focus();

    clearMessage();

}


/* =========================================================
   5. READ / RENDER
   ========================================================= */


/*
    Get tasks according to selected filter.
*/

function getFilteredTasks() {

    if (currentFilter === "active") {

        return tasks.filter(
            task => !task.completed
        );

    }


    if (currentFilter === "completed") {

        return tasks.filter(
            task => task.completed
        );

    }


    return tasks;

}


/*
    Render tasks into the DOM.
*/

function render() {

    const filteredTasks =
        getFilteredTasks();


    /*
        Clear old DOM elements.

        The list is recreated from state.
    */

    taskList.innerHTML = "";


    /*
        Create a DOM element for every task.
    */

    filteredTasks.forEach(task => {

        const taskElement =
            createTaskElement(task);

        taskList.appendChild(taskElement);

    });


    /*
        Update statistics.
    */

    updateStatistics();


    /*
        Update empty state.
    */

    updateEmptyState(
        filteredTasks.length
    );

}


/* =========================================================
   6. CREATE DYNAMIC TASK ELEMENT
   ========================================================= */


/*
    Creates the HTML element for a task dynamically.

    This demonstrates DOM manipulation.
*/

function createTaskElement(task) {

    const article =
        document.createElement("article");


    article.className =
        "task-item";


    article.dataset.taskId =
        task.id;


    if (task.completed) {

        article.classList.add("completed");

    }


    /*
        Checkbox
    */

    const checkbox =
        document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.className =
        "task-checkbox";

    checkbox.checked =
        task.completed;

    checkbox.dataset.action =
        "toggle";


    /*
        Task content
    */

    const content =
        document.createElement("div");

    content.className =
        "task-content";


    const title =
        document.createElement("p");

    title.className =
        "task-title";

    title.textContent =
        task.title;


    const date =
        document.createElement("p");

    date.className =
        "task-date";

    date.textContent =
        formatDate(task.createdAt);


    content.appendChild(title);

    content.appendChild(date);


    /*
        Action buttons
    */

    const actions =
        document.createElement("div");

    actions.className =
        "task-item-actions";


    const editButton =
        document.createElement("button");

    editButton.type = "button";

    editButton.className =
        "icon-button";

    editButton.dataset.action =
        "edit";

    editButton.setAttribute(
        "aria-label",
        "Edit task"
    );

    editButton.title =
        "Edit task";

    editButton.textContent =
        "✎";


    const deleteButton =
        document.createElement("button");

    deleteButton.type = "button";

    deleteButton.className =
        "icon-button delete-button";

    deleteButton.dataset.action =
        "delete";

    deleteButton.setAttribute(
        "aria-label",
        "Delete task"
    );

    deleteButton.title =
        "Delete task";

    deleteButton.textContent =
        "⌫";


    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    /*
        Build final task element.
    */

    article.appendChild(checkbox);

    article.appendChild(content);

    article.appendChild(actions);


    return article;

}


/* =========================================================
   7. UPDATE
   ========================================================= */


/*
    Toggle completed state.
*/

function toggleTask(taskId) {

    const task =
        tasks.find(
            item => item.id === taskId
        );


    if (!task) {

        return;

    }


    task.completed =
        !task.completed;


    saveTasks();

    render();

}


/*
    Update task title.
*/

function updateTask(taskId, newTitle) {

    const cleanTitle =
        newTitle.trim();


    if (!cleanTitle) {

        return false;

    }


    const task =
        tasks.find(
            item => item.id === taskId
        );


    if (!task) {

        return false;

    }


    task.title =
        cleanTitle;


    saveTasks();

    render();


    return true;

}


/* =========================================================
   8. DELETE
   ========================================================= */


/*
    Delete one task.
*/

function deleteTask(taskId) {

    tasks =
        tasks.filter(
            task => task.id !== taskId
        );


    saveTasks();

    render();

}


/*
    Delete all completed tasks.
*/

function clearCompletedTasks() {

    const completedCount =
        tasks.filter(
            task => task.completed
        ).length;


    if (completedCount === 0) {

        showMessage(
            "There are no completed tasks to clear."
        );

        return;

    }


    tasks =
        tasks.filter(
            task => !task.completed
        );


    saveTasks();

    render();

    showMessage(
        `${completedCount} completed task${
            completedCount > 1 ? "s" : ""
        } cleared.`
    );

}


/* =========================================================
   9. STATISTICS
   ========================================================= */

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const active =
        total - completed;


    totalTasksElement.textContent =
        total;


    activeTasksElement.textContent =
        active;


    completedTasksElement.textContent =
        completed;

}


/* =========================================================
   10. FILTERING
   ========================================================= */


/*
    Change current filter.
*/

function changeFilter(filter) {

    currentFilter =
        filter;


    /*
        Update active filter button.
    */

    filterButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.filter === filter
        );

    });


    render();

}


/* =========================================================
   11. EMPTY STATE
   ========================================================= */

function updateEmptyState(count) {

    if (count > 0) {

        emptyState.style.display =
            "none";

        return;

    }


    emptyState.style.display =
        "block";


    /*
        Different message depending
        on selected filter.
    */

    if (
        currentFilter === "completed"
    ) {

        emptyTitle.textContent =
            "No completed tasks";


        emptyText.textContent =
            "Complete a task and it will appear here.";

    }


    else if (
        currentFilter === "active"
    ) {

        emptyTitle.textContent =
            "No active tasks";


        emptyText.textContent =
            "You're all caught up. Nice work!";

    }


    else {

        emptyTitle.textContent =
            "No tasks yet";


        emptyText.textContent =
            "Add your first task above and start making progress.";

    }

}


/* =========================================================
   12. EDIT MODAL
   ========================================================= */


/*
    Open edit modal.
*/

function openEditModal(taskId) {

    const task =
        tasks.find(
            item => item.id === taskId
        );


    if (!task) {

        return;

    }


    editingTaskId =
        taskId;


    editInput.value =
        task.title;


    editModal.classList.remove(
        "hidden"
    );


    editModal.setAttribute(
        "aria-hidden",
        "false"
    );


    setTimeout(() => {

        editInput.focus();

        editInput.select();

    }, 50);

}


/*
    Close edit modal.
*/

function closeEditModal() {

    editingTaskId =
        null;


    editInput.value =
        "";


    editModal.classList.add(
        "hidden"
    );


    editModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   13. EVENT DELEGATION
   ========================================================= */


/*
    Instead of adding separate event listeners
    to every edit/delete button, one listener
    is attached to the parent task list.

    This is called EVENT DELEGATION.
*/

taskList.addEventListener(
    "click",
    function (event) {

        const actionButton =
            event.target.closest(
                "[data-action]"
            );


        if (!actionButton) {

            return;

        }


        const taskElement =
            actionButton.closest(
                ".task-item"
            );


        if (!taskElement) {

            return;

        }


        const taskId =
            taskElement.dataset.taskId;


        const action =
            actionButton.dataset.action;


        if (action === "edit") {

            openEditModal(taskId);

        }


        else if (action === "delete") {

            deleteTask(taskId);

        }

    }
);


/*
    Checkbox event delegation.

    Change event is used because
    checkbox state changes through checked.
*/

taskList.addEventListener(
    "change",
    function (event) {

        if (
            event.target.matches(
                '[data-action="toggle"]'
            )
        ) {

            const taskElement =
                event.target.closest(
                    ".task-item"
                );


            if (!taskElement) {

                return;

            }


            const taskId =
                taskElement.dataset.taskId;


            toggleTask(taskId);

        }

    }
);


/* =========================================================
   14. FORM EVENTS
   ========================================================= */


/*
    Add task form.
*/

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        addTask(taskInput.value);

    }
);


/*
    Filter buttons.
*/

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            changeFilter(
                button.dataset.filter
            );

        }
    );

});


/*
    Clear completed.
*/

clearCompletedButton.addEventListener(
    "click",
    clearCompletedTasks
);


/*
    Edit form.
*/

editForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        if (!editingTaskId) {

            return;

        }


        const updated =
            updateTask(
                editingTaskId,
                editInput.value
            );


        if (updated) {

            closeEditModal();

        }

    }
);


/*
    Modal close buttons.
*/

closeModalButton.addEventListener(
    "click",
    closeEditModal
);


cancelEditButton.addEventListener(
    "click",
    closeEditModal
);


/*
    Close modal by clicking outside it.
*/

editModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === editModal
        ) {

            closeEditModal();

        }

    }
);


/*
    Close modal using Escape.
*/

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            !editModal.classList.contains("hidden")
        ) {

            closeEditModal();

        }

    }
);


/* =========================================================
   15. HELPER FUNCTIONS
   ========================================================= */


/*
    Format task creation date.
*/

function formatDate(dateString) {

    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Recently added";

    }


    return (
        "Added " +
        date.toLocaleDateString(
            undefined,
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        )
    );

}


/*
    Display temporary message.
*/

function showMessage(message) {

    formMessage.textContent =
        message;


    clearTimeout(
        showMessage.timeout
    );


    showMessage.timeout =
        setTimeout(
            clearMessage,
            3000
        );

}


/*
    Clear form message.
*/

function clearMessage() {

    formMessage.textContent =
        "";

}


/* =========================================================
   16. INITIALIZE APPLICATION
   ========================================================= */


/*
    Load saved state and render application
    when the page starts.
*/

loadTasks();

render();

taskInput.focus();