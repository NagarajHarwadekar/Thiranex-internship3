# TaskFlow – Smart Task Manager

A modern client-side To-Do List application built using HTML, CSS and JavaScript.

This project was developed as part of the Thiranex JavaScript Logic & State Management project.

## 🚀 Features

- Create new tasks
- View all tasks
- Edit existing tasks
- Delete tasks
- Mark tasks as completed
- Filter tasks by:
  - All
  - Active
  - Completed
- Clear all completed tasks
- Task statistics
- Persistent data using localStorage
- Dynamic DOM manipulation
- Event delegation
- Responsive design
- No backend required
- Works completely in the browser

## 🧠 JavaScript Concepts Demonstrated

### CRUD

The application implements complete CRUD functionality:

- Create – Add new tasks
- Read – Display tasks
- Update – Edit and complete tasks
- Delete – Remove tasks

### State Management

The `tasks` array acts as the application's state.

Whenever the state changes:

1. The state is updated.
2. The updated state is saved to localStorage.
3. The interface is re-rendered.

### localStorage

Tasks are stored using the browser's `localStorage`.

This means tasks remain available even after refreshing or reopening the page in the same browser.

### DOM Manipulation

Task elements are created dynamically using JavaScript's DOM APIs such as:

- `document.createElement()`
- `appendChild()`
- `classList`
- `dataset`
- `textContent`

### Event Delegation

Instead of attaching individual event listeners to every dynamically created task button, event delegation is used on the task list container.

This allows the application to handle actions for dynamically created tasks efficiently.

## 📂 Project Structure

```text
TaskFlow/
│
├── index.html
├── style.css
├── script.js
└── README.md