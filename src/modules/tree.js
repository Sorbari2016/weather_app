// Imports
import { todoList } from "./template";
import deleteIcon from "../../assets/icons/trash.png";
import descriptionIcon from "../../assets/icons/description.png";
import noteIcon from "../../assets/icons/notes.png";
import { calendarIcon, clearMainArea, mainArea, priorityIcon } from "./dom";
import { displayDate, ImportantIcon, displayNumberOfTasks } from "./node";
import { format } from "date-fns";

// Create a details block
function createDetailBlock({
  icon,
  inputType,
  id,
  name,
  value,
  placeholder = "",
  options = [],
}) {
  let inputElement = "";

  if (inputType === "textarea") {
    inputElement = `<textarea id="${id}" name="${name}" class="change" placeholder="${placeholder}">${value || ""}</textarea>`;
  } else if (inputType === "select") {
    // loop through options and add 'selected' if the value matches
    const optionElements = options
      .map((option) => {
        const isSelected = option.value === value ? "selected" : "";
        return `<option value="${option.value}" ${isSelected}>${option.label}</option>`;
      })
      .join("");

    inputElement = `<select id="${id}" name="${name}" class="change">${optionElements}</select>`;
  } else {
    inputElement = `<input type="${inputType}" id="${id}" name="${name}" value="${value || ""}" class="change" placeholder="${placeholder}">`;
  }

  return `
      <div class="detail">
        <span class="item"> 
          <button type="button"> 
            <img src="${icon}">
          </button>
          ${inputElement}
        </span>
      </div>
    `;
}

// Create a function to view task details
function showTaskDetails(task) {
  // check if task has already been clicked
  if (mainArea.contains(mainArea.querySelector(".left-main-area"))) {
    const rightMain = mainArea.querySelector(".right-main-area");
    rightMain.innerHTML = "";
    renderTaskDetails(task.id, rightMain);
    // get created date
    displayDate(task.createdAt, "EE, MMMM d", ".date-created");
    const tile = rightMain.querySelector(".item.detail");

    updateTileUI(task, tile);
    markTaskAsCompleted(task, tile);
    updateTask(task.id);
    deleteTask(task.id);
    return;
  }
  // Divide main area into two portions
  // left
  const leftMain = document.createElement("div");
  leftMain.classList.add("left-main-area");

  const mainAreaContents = mainArea.children[0];
  mainArea.replaceChild(leftMain, mainAreaContents);
  leftMain.appendChild(mainAreaContents);

  // right
  const rightMain = document.createElement("div");
  rightMain.classList.add("right-main-area");

  // create details markup
  renderTaskDetails(task.id, rightMain);

  mainArea.appendChild(rightMain);

  // get created date
  displayDate(task.createdAt, "EE, MMMM d", ".date-created");

  const tile = rightMain.querySelector(".item.detail");
  updateTileUI(task, tile);
  markTaskAsCompleted(task, tile);
  updateTask(task.id);
  deleteTask(task.id);
}

// Create a method to render the details markup on the right side
function renderTaskDetails(taskId, element) {
  const task = todoList.getById(taskId);

  if (!task) throw new Error("Task not found!");

  // create id for checkbox
  const checkboxId = `checklist-${task.id}`;

  element.innerHTML = "";

  const detailsHtml = `
   <div class="details-pane">
      <div class="details-body">
        <ul class="details-header">
          <li class="item detail" data-task-id="${task.id}">
              <div class="task-title">
                <span class="checkbox">
                  <input type="checkbox" id="${checkboxId}" class="checklist-btn">
                </span>
                <button type="button" class="task-item-title-wrapper">
                  <span class="task-item-title">
                      <input type="text" id="title" name="title" value="${task.title}" class="change">
                  </span>
                  <span class="meta-data-info">Task</span>
                </button>
                <button type="button" class="importance-btn">
                  <img src="${ImportantIcon}" alt="importance icon">
                </button>
              </div>
          </li>
        </ul>
        <div class="details-main">
            ${createDetailBlock({ icon: descriptionIcon, inputType: "textarea", id: "description", name: "desc", value: task.desc, placeholder: "Description" })}
            ${createDetailBlock({ icon: calendarIcon, inputType: "date", id: "dueDate", name: "dueDate", value: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "" })}
            ${createDetailBlock({ icon: noteIcon, inputType: "textarea", id: "notes", name: "notes", value: task.notes, placeholder: "Add a Note..." })}
            ${createDetailBlock({
              icon: priorityIcon,
              inputType: "select",
              id: "priority",
              name: "priority",
              value: task.priority,
              options: [
                { value: "", label: "--Select a priority level--" },
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ],
            })}
        <hr/>
        </div>
      </div>
      <div class="details-footer">
         <span class="item">
            <div class="date-created">Created on</div>
            <button type="button" id="delete-btn">
                <img src="${deleteIcon}" alt="delete icon">
            </button>
         </span>
      </div>
   </div>`;

  const template = document.createElement("template");
  template.innerHTML = detailsHtml.trim();

  return element.appendChild(template.content.firstElementChild);
}

function updateTileUI(task, tile) {
  const isChecked = task.checkList;

  const checkbox = tile.querySelector("input[type='checkbox']");
  const title = tile.querySelector(".task-item-title");

  if (checkbox && title) {
    if (isChecked) {
      checkbox.checked = true;
      title.classList.add("strikethrough");
    } else {
      checkbox.checked = false;
      title.classList.remove("strikethrough");
    }
  }
}

// Create a method to toggle checkbox, & update task
function markTaskAsCompleted(task, tile) {
  // get checkbox element
  const checkbox = tile.querySelector("input[type='checkbox']");

  if (!checkbox) return; // check if in the dom

  // add a handler to listen for checkbox click
  checkbox.addEventListener("change", () => {
    todoList.toggleComplete(task.id);

    // get task tile, & its & tile within expanded form
    const matchingTiles = document.querySelectorAll(
      `[data-task-id="${task.id}"]`,
    );
    sameTask.forEach((matchingTile) => {
      updateTileUI(task, matchingTile);
    });

    // update the number of completed task UI on sidebar
    displayNumberOfTasks(
      "number-of-completed",
      todoList.getAllCompletedTasks(),
    );
  });
}

// Create a method to update task properties
function updateTask(taskId) {
  // get controls
  const controls = document.querySelectorAll(".change");

  if (controls.length === 0) return; // check if details pane is open

  // add handler to each of the controls to listen for change
  controls.forEach((control) => {
    control.addEventListener("change", (e) => {
      // get the name and value attr of a control
      const { name, value } = e.target;

      // get the tile of the task
      const matchingTile = document.querySelector(`[data-task-id="${taskId}"]`);

      // get task
      const task = todoList.getById(taskId);

      // check if the control is the select element
      if (name === "priority") {
        todoList.changePriorityLevel(taskId, value);
        // update tile
        matchingTile.querySelector(".meta-priority").textContent =
          task.priority;
      } else {
        // for the others
        const update = { [name]: value };
        console.log(update);
        todoList.update(taskId, update); // using computed property names

        // update tile for dueDate
        if (name === "dueDate") {
          matchingTile.querySelector(".meta-due").textContent = format(
            task.dueDate,
            "EE-MMM-d",
          );
        }
      }
    });
  });
}

// Create method to delete a task
function deleteTask(taskId) {
  // get delete button
  const deleteBtn = document.getElementById("delete-btn");

  if (!deleteBtn) return; // check if details pane is opened

  // add a handler to listen for delete button click
  deleteBtn.addEventListener("click", () => {
    // delete task
    todoList.delete(taskId);

    // remove details pane & tile
    mainArea.querySelector(".right-main-area").remove();
    mainArea.querySelector(`[data-task-id="${taskId}"]`).remove();

    // restructure the main area
    const leftMain = mainArea.querySelector(".left-main-area");
    const leftAreaContents = leftMain.children[0];
    mainArea.replaceChild(leftAreaContents, leftMain);
    leftMain.remove();
  });
}

export { showTaskDetails, updateTileUI, markTaskAsCompleted };
