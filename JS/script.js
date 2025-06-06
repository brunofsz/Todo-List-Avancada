// Selção de elementos
const todoForm = document.querySelector(".todo-form");
const todoInput = document.querySelector("#input-todo");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector(".edit");
const editInput = document.querySelector("#input-edit");
const eraseSearch = document.querySelector("#eraser");
const searchInput = document.querySelector("#search");
const filterBtn = document.querySelector("#filter-select");
const cancelEdit = document.querySelector("#cancel-edit");
let oldInputValue;

// functions

const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");
  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finaliza-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"> </i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edita-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"> </i>';
  todo.appendChild(editBtn);

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-todo");
  removeBtn.innerHTML = '<i class="fa-solid fa-trash"> </i>';
  todo.appendChild(removeBtn);

  // LS

  if (done) {
    todo.classList.add("feito");
  }
  if (save) {
    saveTodoLocalStorage({ text, done: 0 });
  }

  todoList.appendChild(todo);
  todoInput.value = "";
  todoInput.focus();
};

const trocaForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const atualizaTodo = (txt) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = txt;

      atualizaTodoLs(oldInputValue, txt);
    }
  });
};

const getSearchTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    const txt = search.toLowerCase();
    todo.style.display = "flex";

    if (!todoTitle.includes(txt)) {
      todo.style.display = "none";
    }
  });
};

const filerTodos = (value) => {
  const todos = document.querySelectorAll(".todo");

  switch (value) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;
    case "feitos":
      todos.forEach((todo) =>
        todo.classList.contains("feito")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;
    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("feito")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;
    default:
      break;
  }
};

// events
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const textInput = todoInput.value;
  if (textInput) {
    saveTodo(textInput);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitulo;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitulo = parentEl.querySelector("h3").innerText;
  }
  if (targetEl.classList.contains("finaliza-todo")) {
    parentEl.classList.toggle("feito");

    atualizaStatusTodo(todoTitulo);
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();

    removeTodoLs(todoTitulo);
  }

  if (targetEl.classList.contains("edita-todo")) {
    trocaForms();
    editInput.value = todoTitulo;
    oldInputValue = todoTitulo;
  }
});

cancelEdit.addEventListener("click", (e) => {
  e.preventDefault();
  trocaForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    atualizaTodo(editInputValue);
  }
  trocaForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchTodos(search);
});

eraseSearch.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filerTodos(filterValue);
});

// Local Storage

const getTodosLS = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

const carregaTodos = () => {
  const todos = getTodosLS();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLS();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLs = (text) => {
  const todos = getTodosLS();

  const todoFiltrado = todos.filter((todo) => todo.text !== text);

  localStorage.setItem("todos", JSON.stringify(todoFiltrado));
};

const atualizaStatusTodo = (text) => {
  const todos = getTodosLS();

  todos.map((todo) => (todo.text === text ? (todo.done = !todo.done) : null));

  localStorage.setItem("todos", JSON.stringify(todos));
};

const atualizaTodoLs = (oldText, newText) => {
  const todos = getTodosLS();

  todos.map((todo) => (todo.text === oldText ? (todo.text = newText) : null));

  localStorage.setItem("todos", JSON.stringify(todos));
};

carregaTodos();
