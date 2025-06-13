/**
 * JavaScript for the ToDo list application
 */


/** @type {HTMLInputElement} */
const todoInput = document.querySelector('input');

/** @type {HTMLUListElement} */
const todoList = document.querySelector('ul');

/** @type {HTMLTemplateElement} */
const todoTemplate = document.getElementById('todo-template');

/**
 * Initializes the todo list application.
 */
function main() {
    loadState();
    document.querySelector('form').addEventListener('submit', addTodo);
}

/**
 * Adds a new todo item to the list.
 *
 * @param {Event} event
 */
function addTodo(event) {
    /** @type string */
    const todoText = todoInput.value.trim();

    event.preventDefault();
    if (!todoText) {
        return;
    }

    /** @type {HTMLLIElement} */
    const todoItem = todoTemplate.content.querySelector('li').cloneNode(true);
    /** @type {HTMLSpanElement} */
    const span = todoItem.querySelector('span');
    /** @type {HTMLButtonElement} */
    const button = todoItem.querySelector('button');

    span.textContent = todoText;
    todoItem.addEventListener('click', toggleTodoDone);
    button.addEventListener('click', deleteTodo);

    runAnimation(todoItem, 'fade-out', 0.5, true);

    todoList.insertBefore(todoItem, todoList.firstChild);
    todoInput.value = '';
    todoInput.focus();
    saveState();
}

/**
 * Toggles the done state of a todo item.
 *
 * @param {Event} event
 */
function toggleTodoDone(event) {
    /** @type {HTMLSpanElement} */
    const span = event.target.closest('li').querySelector('span');

    span.classList.toggle('done');
    saveState();
}

/**
 * Deletes a todo item from the list.
 *
 * @param {Event} event
 * @returns {Promise<void>}
 */
async function deleteTodo(event) {
    /** @type {HTMLLIElement} */
    const todoItem = event.target.parentElement;

    event.stopPropagation();
    await runAnimation(todoItem, 'fade-out');
    todoList.removeChild(todoItem);
    saveState();
}

/**
 * Saves the todo list state to local storage.
 */
function saveState() {
    /** @type {Array<{text: string, done: boolean}>} */
    const todos = [];

    for (const todo of todoList.querySelectorAll('li')) {
        /** @type {HTMLSpanElement} */
        const span = todo.querySelector('span');

        todos.push({
            text: span.textContent,
            done: span.classList.contains('done')
        });
    }
    localStorage.setItem('todos', JSON.stringify(todos));
}

/**
 * Loads the todo list state from local storage.
 */
function loadState() {
    /** @type {Array<{text: string, done: boolean}>} */
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');

    for (const todo of todoList.querySelectorAll('li')) {
        todoList.removeChild(todo);
    }

    for (const todo of todos) {
        /** @type {HTMLLIElement} */
        const todoItem = todoTemplate.content.querySelector('li').cloneNode(true);
        /** @type {HTMLSpanElement} */
        const span = todoItem.querySelector('span');
        /** @type {HTMLButtonElement} */
        const button = todoItem.querySelector('button');

        span.textContent = todo.text;
        if (todo.done) {
            span.classList.add('done');
        }

        todoItem.addEventListener('click', toggleTodoDone);
        button.addEventListener('click', deleteTodo);
        todoList.appendChild(todoItem);
    }
}


/**
 * Runs an animation on the given element.
 *
 * @param {HTMLElement} elm
 * @returns {Promise<void>}
 */
function runAnimation(elm, animationName, duration = 0.5, reverse = false, easing = 'ease-in-out') {
    return new Promise((resolve, reject) => {
        if (!elm) {
            reject(new Error('Element not found'));
        }

        const animationEndHandler = event => {
            if (event.animationName === animationName) {
                elm.removeEventListener('animationend', animationEndHandler);
                elm.style.animation = '';
                resolve();
            }
        };

        elm.addEventListener('animationend', animationEndHandler);
        elm.style.animation = `${animationName} ${duration}s ${easing} ${reverse ? 'reverse' : ''}`;
    });
}

main();
