// CLICK BUTTONS DOM
import { clearMainArea, mainArea, createModal, renderMainArea } from "./dom";
import { sortIcon, calendarIcon, priorityIcon } from "./dom";
import categoryIcon from "../../assets/icons/category.png";
import originDateIcon from "../../assets/icons/creation.png";
import closeIcon from "../../assets/icons/close-icon.png";
import { todoList } from "./template";
import { createTaskTile, renderProjectArea } from "./node";

// Create a dom method to render projects
function renderMyProjects(projects) {
  // clear main area
  clearMainArea();

  // create project html
  const container = document.createElement("div");
  container.classList.add("projects-container");

  container.innerHTML = `
        <h2>My Projects</h2>
        <div class="project-area">
            <ul class="projects-main"></ul>
        </div>
        <div class="new-project">
            <button type="button" class="btn">Add project</button>
        </div>
    `;

  mainArea.appendChild(container);

  // create project list items
  const projectList = document.querySelector(".projects-main");

  projects.forEach((project) => {
    const item = document.createElement("li");
    // each list should be a tile
    item.classList.add("item", "folder");
    item.textContent = project.name;

    projectList.appendChild(item);
  });

  // render project area for a particular project
  createTaskInFolder();

  // handle add project button
  const newProjectContainer = mainArea.querySelector(".new-project");
  const newProjectBtn = newProjectContainer.firstElementChild;

  const form = createAddProjectForm();
  newProjectBtn.addEventListener("click", () => {
    // add open class to form
    form.classList.add("open");

    // replace Add project button with the form
    newProjectContainer.replaceChild(form, newProjectBtn);
  });

  // handle cancel & add button events
  handleCancel(newProjectContainer, form, newProjectBtn);

  // handle submit button event
  handleSubmit(newProjectContainer, form, newProjectBtn, "folder");
}

// Create method to add task in a folder
function createTaskInFolder() {
  // select folders
  const projects = document.querySelector(".projects-main");

  // add listener
  projects.addEventListener("click", (e) => {
    const project = e.target.closest("li");

    if (project && projects.contains(project)) {
      // clear main area
      clearMainArea();

      const folderName = project.textContent;
      const tasks = todoList.listManager.getFolderByName(folderName)?.lists;

      renderProjectArea(folderName, tasks);
    }
  });
}

function addProject() {
  // select the add project button
  const projects = document.querySelector(".projects");

  // replace add button with form
  const form = createAddProjectForm();
  form.classList.add("open");
  const plusBtn = projects.children[1];
  projects.replaceChild(form, plusBtn);

  // manage cancel btn event
  handleCancel(projects, form, plusBtn);

  // manage submit button event
  handleSubmit(projects, form, plusBtn, "folder");
}

// Create a function to show, & remove sort popup content
function sort() {
  // create list details
  const details = new List();
  details.addListItem(sortIcon, "Alphabetically", "sort icon");
  details.addListItem(calendarIcon, "Deadline", "deadline icon");
  details.addListItem(priorityIcon, "Priority", "priority icon");
  details.addListItem(originDateIcon, "Creation Date", "original date icon");

  // create modal
  createModal("sort", details.list);
}

// Create a function to show, & renove the group pop up content
function group() {
  // create list details
  const details = new List();
  details.addListItem(categoryIcon, "Categories", "categories icons");

  // create modal
  createModal("group", details.list);
}

search();

// Create search markup function
function search() {
  // select the search tab container
  const searchTab = document.querySelector(".search-tab");

  // select the input element
  const searchInput = searchTab.querySelector("#search");

  // add a focus handler to the input element
  searchInput.addEventListener("focus", () => {
    const existingBtn = searchTab.querySelector("#close-btn");
    // only run the creation code if it isnt there
    if (!existingBtn) {
      // add a close button to the search tab,  & placeholder
      const closeBtn = document.createElement("button");
      closeBtn.setAttribute("id", "close-btn");

      // add placeholder to the input
      searchInput.placeholder = "Search";

      // create icon, and attach to the close btn
      const img = document.createElement("img");
      img.src = closeIcon;
      img.alt = "close icon";
      closeBtn.appendChild(img);

      // attached the button to the search tab
      searchTab.appendChild(closeBtn);
    }
  });

  // add input evnt handler
  searchInput.addEventListener("input", (e) => {
    // get user input
    const query = searchInput.value;

    // clear the man area
    clearMainArea();

    // rebuild main area
    mainArea.innerHTML = `
      <div class="search-container">
        <p class="query-text">
          Searching for "${query}"
        </p>
        <div class="query-result">
        </div>
      </div>
    `;

    // find tasks
    const cleanQuery = query.trim();
    const matchedTasks = todoList.filterByChar(cleanQuery);

    // select the query-result contaianser
    const queiriesContainer = mainArea.querySelector(".query-result");

    // check if there are matches
    if (query && matchedTasks.length > 0) {
      // const create an unordered list, & tasks class
      const list = document.createElement("ul");
      list.setAttribute("class", "tasks");

      matchedTasks.forEach((task) => {
        // create a list item
        const listItem = createTaskTile(task);
        // append to underored list element
        list.appendChild(listItem);
      });

      // append unordered list to the queries div container
      queiriesContainer.appendChild(list);
    } else {
      // when there is not match
      const paragraph = document.createElement("p");
      paragraph.classList.add("no-tasks");
      paragraph.textContent = "No task was found";
      queiriesContainer.appendChild(paragraph);
    }
  });

  // add event delegation to listen close button click
  searchTab.addEventListener("click", (e) => {
    // check if the click target or its parent image is the close button
    const closeBtn = e.target.closest("#close-btn");

    if (closeBtn) {
      // check if an query was made
      const toolbar = mainArea.querySelector(".toolbar");

      if (mainArea.contains(toolbar)) {
        // remove close button, reset input placeholder
        closeBtn.remove();
        searchInput.placeholder = "";
      } else {
        // remove close button, reset input placeholder, & value
        closeBtn.remove();
        searchInput.placeholder = "";
        searchInput.value = "";

        // clear main area
        clearMainArea();

        // re-render main area
        renderMainArea();
      }
    }
  });

  // handle clicks outside the search tab
  document.addEventListener("click", (e) => {
    // check if the cick is inside the search tab
    const isClickInside = searchTab.contains(e.target);

    // check if input is empty
    const isInputEmpty = searchInput.value === "";

    if (!isClickInside && isInputEmpty) {
      // check is close button exists
      const closeBtn = searchTab.querySelector("#close-btn");

      if (closeBtn) {
        searchInput.placeholder = "";
        closeBtn.remove();
      }
    }
  });
}

// UTILITIES

// Create add Project form
function createAddProjectForm() {
  const htmlString = `
        <form id="new-project-form">
            <div class="form-item">
                <input
                    type="text"
                    name="projectName"
                    id="project-name"
                    placeholder="Add a project"
                >
            </div>
            <div class="form-actions">
                <button type="button" class="btn cancel-btn">Cancel</button>
                <button type="submit" class="btn add-project-btn">Add</button>
            </div>
        </form>
    `;

  // make it an actual node
  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();

  // return actual dom
  return template.content.firstElementChild;
}

// Create a method to handle cancel btn
function handleCancel(container, form, button) {
  form.querySelector(".cancel-btn").addEventListener("click", () => {
    form.classList.remove("open");
    container.replaceChild(button, form);
  });
}

// Create a method to handle submit btn
function handleSubmit(
  container,
  form,
  button,
  itemType = "task",
  projectName = "Project",
) {
  // add handler to listen for submit event
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // check if form has a checkbox
    const checkbox = form.querySelector("input [type='checkbox']");

    if (checkbox) {
      // disable checkbox
      checkbox.disabled = true;
    }

    // grabs all inputs that have a "name" attribute
    const data = new FormData(form);

    // check the type of item (folder or list)
    if (itemType === "task") {
      // get values
      const title = data.get("title")?.trim();
      const desc = data.get("desc")?.trim();
      const dueDate = data.get("dueDate")?.trim();
      const notes = data.get("notes")?.trim();
      const priorityLevel = data.get("priorityLevel")?.trim();

      // get project name
      const folderName = projectName;

      // ensure task has a title
      if (!title) {
        alert("Your task must have a title");
        return;
      }

      // add task
      todoList.add(title, desc, dueDate, priorityLevel, notes, folderName);
    } else if (itemType === "folder") {
      const folderName = data.get("projectName")?.trim();

      if (!folderName) return alert("folder name cannot be empty!");

      todoList.createFolder(folderName);

      // re-render the projects area with updated structure
      renderMyProjects(todoList.listManager.getFolders());
    }

    // reset form, & replace form with button
    form.reset();
    form.classList.remove("open");
    container.replaceChild(button, form);
  });
}

// Create a method to construct a list item for modal
function createListItem(image, content, alt) {
  const htmlString = `
      <li class="item">
          <img src="${image}" alt="${alt}">
        ${content}
      </li>
  `;
  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();

  return template.content.firstElementChild;
}

// Create a class for list item details
class ListItem {
  constructor(image, content, alt) {
    this.image = image;
    this.content = content;
    this.alt = alt;
  }
}

// Create a class for the List
class List {
  constructor() {
    this.list = [];
  }

  addListItem(image, content, alt) {
    if (!image || !content || !alt) {
      throw new Error("Image, content and alt of item are required!");
    }

    const newItem = new ListItem(image, content, alt);
    this.list.push(newItem);
  }
}

export {
  renderMyProjects,
  addProject,
  sort,
  group,
  createListItem,
  handleCancel,
  handleSubmit,
};
