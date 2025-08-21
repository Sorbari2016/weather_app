// FIRST MODULE

function homepage() {
// Content the DOM element content
const content = document.getElementById("content"); 



// Create the container and the main section containers, append to content
const heroes = document.createElement("div"); 
heroes.classList.add("container", "main_section"); 
content.appendChild(heroes); 

// Create the bootstrap row class
const row = document.createElement("div"); 
row.classList.add("row"); 
heroes.appendChild(row); 

// Create the top section
const topSection = document.createElement("div"); 
topSection.classList.add("col", "top"); 
row.appendChild(topSection); 

// Create the headings
const h1 = document.createElement("h1"); 
const h3 = document.createElement("h3"); 

topSection.append(h1, h3); 
h1.textContent = 'Home of Tasty Meals'; 
h3.textContent = "We can't wait to take your orders"; 

const row2 = document.createElement("div"); 
row2.classList.add("row"); 
heroes.appendChild(row2); 

// Create the bottom section of the heroes
const bottomSection = document.createElement("div"); 
bottomSection.classList.add("col", "bottom"); 
row2.appendChild(bottomSection); 

// Create form element and attached to bottom section
const form = document.createElement("form"); 
bottomSection.appendChild(form);

const btn = document.createElement("button"); 
btn.type = 'button'; 
btn.textContent = "Place your order"; 

form.appendChild(btn); 



// THE FOOTER SECTION
const footerContainer = document.createElement("div"); 
footerContainer.classList.add("container"); 
content.append(footerContainer); 


// Create the footer element,its classes and append to content
const footer = document.createElement("footer"); 
footer.classList.add("d-flex", "flex-wrap", "justify-content-between", "align-items-center", "py-3", "border-top");
footerContainer.appendChild(footer);

// Create paragraph to hold the footer text
const footerText = document.createElement("p"); 
footerText.textContent = "© 2025 Sarah's Delicacies";  
footer.appendChild(footerText); 
}

// Export the function
 
export default homepage; 

 





