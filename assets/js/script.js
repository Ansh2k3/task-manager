'use strict';



// select all DOM elements

const headerTime = document.querySelector("[data-header-time]");
const menuTogglers = document.querySelectorAll("[data-menu-toggler]");
const menu = document.querySelector("[data-menu]");
const themeBtns = document.querySelectorAll("[data-theme-btn]");
const modalTogglers = document.querySelectorAll("[data-modal-toggler]");
const welcomeNote = document.querySelector("[data-welcome-note]");
const taskList = document.querySelector("[data-task-list]");
const taskInput = document.querySelector("[data-task-input]");
const modal = document.querySelector("[data-info-modal]");
let taskItem = {};
let taskRemover = {};

// store current date from build-in date object
const date = new Date();

// import task complete sound
const taskCompleteSound = new Audio("./assets/sounds/task-complete.mp3");






/**
 * convert weekday number to weekday name
 * totalParameter: 1;
 * parameterValue: <number> 0-6;
 */

const getWeekDayName = function (dayNumber) {
  switch (dayNumber) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Satureday";
    default:
      return "Not a valid day";
  }
}



/**
 * convert month number to month name
 * totalParameter: 1;
 * parameterValue: <number> 0-11;
 */

const getMonthName = function (monthNumber) {
  switch (monthNumber) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "Jun";
    case 6:
      return "Jul";
    case 7:
      return "Aug";
    case 8:
      return "Sep";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    case 11:
      return "Dec";
    default:
      return "Not a valid month";
  }
}



// store weekday name, month name & month-of-day number
const weekDayName = getWeekDayName(date.getDay());
const monthName = getMonthName(date.getMonth());
const monthOfDay = date.getDate();

// update headerTime date
headerTime.textContent = `${weekDayName}, ${monthName} ${monthOfDay}`;



/**
 * toggle active class on element
 * totalParameter: 1;
 * parameterValue: <object> elementNode;
 */

const elemToggler = function (elem) { elem.classList.toggle("active"); }



/**
 * toggle active class on multiple elements
 * totalParameter: 2;
 * parameterValue: <object> elementNode, <function> any;
 */

const addEventOnMultiElem = function (elems, event) {
  for (let i = 0; i < elems.length; i++) {
    elems[i].addEventListener("click", event);
  }
}



/**
 * create taskItem elementNode and return it
 * totalParameter: 1;
 * parameterValue: <string> any;
 */

const taskItemNode = function (taskText) {
  const createTaskItem = document.createElement("li");
  createTaskItem.classList.add("task-item");
  createTaskItem.setAttribute("data-task-item", "");

  createTaskItem.innerHTML = `
  
    <button class="item-icon" data-task-remove="complete">
      <span class="check-icon"></span>
    </button>
    <p class="item-text">${taskText}</p>
    <button class="item-action-btn" aria-label="Edit task" data-task-edit>
      <ion-icon name="pencil-outline" aria-hidden="true"></ion-icon>
    </button>
    <button class="item-action-btn" aria-label="Remove task" data-task-remove>
      <ion-icon name="trash-outline" aria-hidden="true"></ion-icon>
    </button>
    <input type="text" class="edit-input" data-task-edit-input>
    <button class="item-action-btn" style="display: none;">Save</button>
  `;

  return createTaskItem;
}



const editTask = function () {
  const taskTextElement = this.parentElement.querySelector(".item-text");
  const editInput = this.parentElement.querySelector(".edit-input");

  // Hide the task text and display the input field
  taskTextElement.style.display = "none";
  editInput.style.display = "block";
  editInput.value = taskTextElement.textContent;
  editInput.focus();

  // Add a "Save" button
  const saveButton = document.createElement("button");
  saveButton.classList.add("item-action-btn");
  saveButton.textContent = "Save";
  saveButton.addEventListener("click", function () {
    taskTextElement.textContent = editInput.value;
    taskTextElement.style.display = "block";
    editInput.style.display = "none";
    this.remove(); // Remove the "Save" button after saving
    saveData();
  });

  this.parentElement.appendChild(saveButton);

  // Add an event listener to save changes on Enter key press
  editInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      taskTextElement.textContent = editInput.value;
      taskTextElement.style.display = "block";
      editInput.style.display = "none";
      saveButton.remove(); // Remove the "Save" button after saving
      saveData();
    }
  });
}





/**
 * task input validation
 * totalParameter: 1;
 * parameterValue: <string> any
 */

const taskInputValidation = function (taskIsValid) {
  if (taskIsValid) {
    // Create a new task item
    const newTaskItem = taskItemNode(taskInput.value);

    // Insert the new task item at the beginning of the task list
    taskList.insertBefore(newTaskItem, taskList.firstChild);

    // Clear the input field
    taskInput.value = "";

    // Hide the welcome note
    welcomeNote.classList.add("hide");

    // Update taskItem DOM selection
    taskItem = document.querySelectorAll("[data-task-item]");
    taskRemover = document.querySelectorAll("[data-task-remove]");
  } else {
    alert("Please write something!");
  }
}




/**
 * if there is an existing task,
 * the welcome note will be hidden
 */

const removeWelcomeNote = function () {
  if (taskList.childElementCount > 0) {
    welcomeNote.classList.add("hide");
  } else {
    welcomeNote.classList.remove("hide");
  }
}



/**
 * removeTask when click on delete button or check button
 */

const removeTask = function () {
  const parentElement = this.parentElement;

  if (this.dataset.taskRemove === "complete") {
    parentElement.classList.toggle("complete"); // Toggle "complete" class
    taskCompleteSound.play();
    saveData();

    // Move the completed task to the bottom
    if (parentElement.classList.contains("complete")) {
      taskList.appendChild(parentElement);
    }
  } else {
    // Check if it's an uncompleted task
    if (!parentElement.classList.contains("complete")) {
      taskList.insertBefore(parentElement, taskList.firstChild); // Move it to the top
    }
    parentElement.remove();
    removeWelcomeNote();
    saveData();
  }
}





/**
 * addTask function
 */

const addTask = function () {

  // check the task inpu validation
  taskInputValidation(taskInput.value);

  // addEventListere to all taskItem checkbox and delete button
  addEventOnMultiElem(taskRemover, removeTask);

  const taskEditBtns = document.querySelectorAll("[data-task-edit]");
  addEventOnMultiElem(taskEditBtns, editTask);
  saveData();


}



/**
 * add keypress listener on taskInput
 */

taskInput.addEventListener("keypress", function (e) {

  // addTask if user press 'Enter'
  switch (e.key) {
    case "Enter":
      addTask();
      break;
  }

});



// toggle active class on menu when click on menuBtn or dropdownLink 
const toggleMenu = function () { elemToggler(menu); }
addEventOnMultiElem(menuTogglers, toggleMenu);

// toggle active class on modal when click on dropdownLink or modal Ok button
const toggleModal = function () { elemToggler(modal); }
addEventOnMultiElem(modalTogglers, toggleModal);



/**
 * add "loaded" class on body when website is fully loaded
 */

window.addEventListener("load", function () {
  document.body.classList.add("loaded");
});


function saveData() {
  localStorage.setItem("data", taskList.innerHTML);
}



/**
 * change body background when click on any themeBtn
 */

const themeChanger = function () {
  // store hue value from clicked themeBtn
  const hueValue = this.dataset.hue;

  // create css custom property on root and set value from hueValue
  document.documentElement.style.setProperty("--hue", hueValue);

  // remove "active" class from all themeBtns
  for (let i = 0; i < themeBtns.length; i++) {
    if (themeBtns[i].classList.contains("active")) {
      themeBtns[i].classList.remove("active");
    }
  }

  // add "active" class on clicked themeBtn
  this.classList.add("active");
}

// add event on all themeBtns
addEventOnMultiElem(themeBtns, themeChanger);

function showTask() {
  taskList.innerHTML = localStorage.getItem("data");
  // Add event listeners to task items (checkboxes and delete buttons)
  taskRemover = document.querySelectorAll("[data-task-remove]");
  addEventOnMultiElem(taskRemover, removeTask);

  const taskEditBtns = document.querySelectorAll("[data-task-edit]");
  addEventOnMultiElem(taskEditBtns, editTask);
  removeWelcomeNote();
}

showTask();