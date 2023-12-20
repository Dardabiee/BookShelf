const todos = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

function generateId() {
  return +new Date();
}
function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}
function findBookIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
  return -1;
}
function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  }
}
function saveData(){
  if(isStorageExist){
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
function isStorageExist(){
  if (typeof(Storage) === 'undefined'){
    alert('Maaf Browser anda tidak mendukung local storage');
    return false;
  }
  return true;
}
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeShelf(bookObject){
  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.title;

  const textPages = document.createElement('p');
  textPages.innerText = bookObject.author;

  const textDate = document.createElement('h5');
  textDate.innerText = bookObject.year;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textPages, textDate);
  
  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `book-${bookObject.id}`);
  
  if (bookObject.isComplete){
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.innerHTML = `<i class='bx bxs-checkbox-checked'></i>`;
    
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(bookObject.id);
    });
    
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.innerHTML = `<i class='bx bx-trash' ></i>`;
    
    trashButton.addEventListener('click', function(){
      removeTaskCompleted(bookObject.id);
    });
    
    trashButton.addEventListener('click', function(){
      removeTaskCompleted(bookObject.id);
    });

    container.append(undoButton, trashButton);
  }else{
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.innerHTML = `<i class='bx bx-check-circle'></i>`;

    checkButton.addEventListener('click', function(){
      addTaskCompleted(bookObject.id);
    });
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.innerHTML = `<i class='bx bx-trash' ></i>`;
    
    trashButton.addEventListener('click', function(){
      removeTaskCompleted(bookObject.id);
    });
    container.append(checkButton, trashButton);
  }
  
  return container;
}
function addBook(title, author, year, form){
  const textBook = document.getElementById('title').value;
  const pages = document.getElementById('author').value;
  const time = parseInt(document.getElementById('year').value);
  const submitForm = document.getElementById('form').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  const generatedId = generateId();
  const bookObject = generateBookObject(generatedId, textBook, pages, time, isComplete, submitForm, false);
  
  
  if (isComplete) {
    todos.push(bookObject); 
  } else {
    todos.unshift(bookObject); 
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function addTaskCompleted (todoId) {
  const todoTarget = findTodo(todoId);
 
  if (todoTarget == null) return;
 
  todoTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function removeTaskCompleted(todoId){
  const bookTarget = findBookIndex(todoId);

  if (bookTarget === -1) return;
  todos.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);
 
  if (todoTarget == null) return;
 
  todoTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
// document.addEventListener(SAVED_EVENT, function () {
//   console.log(localStorage.getItem(STORAGE_KEY));
// });
document.addEventListener('DOMContentLoaded', function(){
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function(event){
    event.preventDefault();
    addBook(generateBookObject);  //tambahan
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
  document.addEventListener(SAVED_EVENT, function() {
    console.log('berhasil')
  });
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBook = document.getElementById('todos');
  uncompletedBook.innerHTML = '';
  const completedBookShelf = document.getElementById('completed-todos');
  completedBookShelf.innerHTML = '';
 //   console.log(localStorage.getItem(STORAGE_KEY));
  for (const todoItem of todos) {
    const todoElement = makeShelf(todoItem);
    if (!todoItem.isComplete) {
      uncompletedBook.append(todoElement);
    }else{
    completedBookShelf.append(todoElement);
    }
  }
});