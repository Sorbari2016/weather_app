// DOM LOGIC, & METHODS

// imports
import priorityIcon from "../../assets/icons/priority_flag.png";
import sunnyIcon from "../../assets/icons/sunny.png";
import sortIcon from "../../assets/icons/arrow.png";
import groupIcon from "../../assets/icons/group-icon.png";
import calendarIcon from "../../assets/icons/calendar.png";
import notificationIcon from "../../assets/icons/bell.png";
import repeatIcon from "../../assets/icons/repeat.png";
import {
  renderMyProjects,
  addProject,
  sort,
  group,
  createListItem,
} from "./branch";
import { format } from "date-fns";
import {
  addMainAreaTask,
  displayDate,
  displayNumberOfTasks,
  renderGroupedTasks,
} from "./node";
import { todoList } from "./template";

// Hamburger method
// select elements
const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger-btn");
const overlay = document.querySelector(".overlay");

// create handler to handle sidebar button click
hamburger.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
});

// create a handler to handle overlay click
overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
});

// MAIN AREA MANIPULATION
const mainArea = document.getElementById("main-area");

// Create method to clear main area
function clearMainArea() {
  mainArea.innerHTML = "";
}

// Creea function to re-render main area
function renderMainArea() {
  mainArea.innerHTML = `
          <div class="toolbar">
            <div class="toolbar-top">
              <div class="toolbar-headline">
                <div class="title">
                  <img
                    src="${sunnyIcon}"
                    alt="sunny day icon"
                  /><span>My Day</span>
                </div>
                <div class="today-date"></div>
              </div>
              <div class="toolbar-right">
                <ul class="toolbar-nav">
                  <li class="item main-item">
                    <button id="sort" class="btn click-btn">
                      <img src="${sortIcon}" alt="sort icon" />
                      Sort
                    </button>
                  </li>
                  <li class="item main-item">
                    <button id="group" class="btn click-btn">
                      <img
                        src="${groupIcon}"
                        alt="group icon"
                      />
                      Group
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div class="toolbar-children"></div>
          </div>
          <div class="flex-container">
            <div class="add-task-container">
              <form action="#" class="add-task-form-concise-m">
                <div class="add-task-top">
                  <input type="checkbox" class="checklist-btn" />
                  <input
                    type="text"
                    name="title"
                    id="add-task"
                    maxlength="255"
                    placeholder="Add a task"
                  />
                </div>
                <div class="add-task-bottom">
                  <div class="add-task-icons">
                    <ul>
                      <li class="item main-item">
                        <img
                          src="${calendarIcon}"
                          alt="calender icon"
                        />
                      </li>
                      <li class="item main-item">
                        <img
                          src="${notificationIcon}"
                          alt="notification icon"
                        />
                      </li>
                      <li class="item main-item">
                        <img src="${repeatIcon}" alt="repeat icon"/>
                      </li>
                    </ul>
                  </div>
                  <button id="add-btn" type="submit" class="click-btn">Add</button>
                </div>
              </form>
            </div>
            <div class="added-task-list">
              <ul class="tasks"></ul>
            </div>
          </div>
  `;

  // Create dynamic date content
  const now = new Date();
  displayDate(now, "EEEE, MMMM d", ".today-date");

  // add listeners to Sort & Group buttons
  const toolbar = document.querySelector(".toolbar");
  toolbar.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.id === "sort") {
        sort();
      } else if (btn.id === "group") group();
    });
  });
}

// Add Event delegation on the sidebar top section
[...document.getElementById("sidebar").children][0].addEventListener(
  "click",
  (e) => {
    if (e.target.tagName === "BUTTON") {
      const buttonID = e.target.getAttribute("id");

      if (buttonID === "add-task-sidebar") {
        getAddTaskForm();
      } else if (buttonID === "upcoming") {
        renderGroupedTasks("Upcoming", todoList.getAllUpcomingTasks());
      } else if (buttonID === "completed") {
        renderGroupedTasks("Completed", todoList.getAllCompletedTasks());
      } else if (buttonID === "today-tasks") {
        renderGroupedTasks("Today", todoList.getAllTodayTasks());
      }
    }
  },
);

// show number of tasks on sidebar buttons
displayNumberOfTasks("number-of-upcoming", todoList.getAllUpcomingTasks());
displayNumberOfTasks("number-of-completed", todoList.getAllCompletedTasks());
displayNumberOfTasks("number-of-today", todoList.getAllTodayTasks());

// Create a method for the add task button
function getAddTaskForm() {
  // clear the main area
  clearMainArea();

  // create form element
  const form = document.createElement("form");
  form.setAttribute("id", "add-task-form");

  // create form markup
  form.innerHTML = `
        <h2>Create a New Task</h2>
        <div class="form-item">
            <input type="checkbox" id="checkbox" name="checklist">
            <input type="text" name="title" id="title" placeholder="Read for 3 hours..." required>
        </div>
        <div class="form-item">
            <textarea name="desc" id="desc" placeholder="Describe your task"></textarea>
        </div>
        <div class="form-item">
            <input type="date" id="due-date" name="dueDate">
        </div>
        <div class="form-item">
            <input type="text" name="notes" id="note" placeholder="Add a note...">
        </div>
        <div class="form-item">
            <img src="${priorityIcon}" alt="priority icon">
            <select name="priority" id="priority">
                <option value="">--Select a priority level--</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
        </div>
        <div class="form-actions">
            <button  type = "button" class="cancel-btn">Cancel</a>
            <button type = "submit" class="add-task-btn">Add</button>
        </div>
    `;
  // append to main area
  mainArea.appendChild(form);

  // add event handler for the cancel btn
  form.querySelector(".cancel-btn").addEventListener("click", () => {
    clearMainArea();
    renderMainArea();
  });

  // add task
  addTask("#add-task-form", "complete", (newTask) => {
    alert(`The task: ${newTask.title} has been created!`);
  });
}

// Create a function to add task
function addTask(formEl, formType = "Concise", onTaskCreated) {
  // get the form
  const form = document.querySelector(formEl);

  // add a handler to listen for submit
  form.addEventListener("submit", (e) => {
    // prevent form from submitting
    e.preventDefault();

    // get checkbox and disable
    const checkbox = form.querySelector("input[type='checkbox']");
    checkbox.disabled = true;

    // get form data
    const data = new FormData(form);

    // select title
    const title = data.get("title")?.trim();

    // ensure task has a title
    if (!title) {
      alert("Your task must have a title!");
      checkbox.disabled = false;
      return;
    }

    let newTask; // to store created task

    // check the type of form
    if (formType === "concise") {
      newTask = todoList.add(title);
    } else if (formType === "complete") {
      // get other values
      const desc = data.get("desc")?.trim();
      const dueDate = data.get("dueDate")?.trim();
      const notes = data.get("notes")?.trim();
      const priorityLevel = data.get("priority")?.trim();

      newTask = todoList.add(title, desc, dueDate, priorityLevel, notes);
    }

    // pass the new task to the rest of the app
    if (newTask && typeof onTaskCreated === "function") {
      onTaskCreated(newTask);
    }

    // reset form, enable checkbox
    checkbox.disabled = false;
    form.reset();
  });
}

// Get user created folders
const folders = todoList.listManager.directory;

// Handle buttons with the class click-btn
document.querySelectorAll(".click-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const buttonID = e.target.getAttribute("id");

    switch (buttonID) {
      case "my-projects":
        renderMyProjects(folders);
        break;
      case "add-project":
        addProject();
        break;
      case "sort":
        sort();
        break;
      case "group":
        group();
        break;
      default:
        // do nothing
        break;
    }
  });
});

// Create dynamic date content
const now = new Date();
displayDate(now, "EEEE, MMMM d", ".today-date");

// Create task from static input
addMainAreaTask();

// Create a reusable modal function
function createModal(elementId, listDetails) {
  // select clicked element
  const element = document.getElementById(elementId);

  // check if element exist in the dom
  if (!element) throw new Error("Element not found!");

  // disable the button
  element.disabled = true;

  // create div element and give it a class card
  const card = document.createElement("div");
  card.classList.add("card");

  // create a heading text
  const heading = elementId[0].toUpperCase() + elementId.slice(1);

  // create the card html
  card.innerHTML = `
    <h4>${heading} by </h4>
    <hr/>
    <ul class="${elementId}_menu"> 
    </ul>
  `;
  const list = card.querySelector("ul"); // add list items, & append to the parent, ul
  listDetails.forEach((item) => {
    const listItem = createListItem(item.image, item.content, item.alt); // create li markup
    list.appendChild(listItem); // append to ul
  });

  // attach the card to the list that hods the element
  const parentElement = element.closest(".main-item");
  parentElement.appendChild(card);

  // create event handler for outside click
  document.addEventListener("click", (e) => {
    if (!parentElement.contains(e.target)) {
      // remove if card is still attached or exist
      if (parentElement.contains(card)) {
        parentElement.removeChild(card);
      }

      // enable button
      element.disabled = false;
    }
  });
}

export {
  clearMainArea,
  mainArea,
  createModal,
  renderMainArea,
  sortIcon,
  calendarIcon,
  priorityIcon,
  addTask,
};
