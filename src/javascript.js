
function backgroundFooter() {

const content = document.getElementById("content"); 

    // THE FOOTER SECTION
const footerContainer = document.createElement("div"); 
footerContainer.classList.add("container"); 
content.append(footerContainer); 


// Create the footer element,its classes and append to content
const footer = document.createElement("footer"); 
footer.classList.add("d-flex", "flex-wrap", "align-items-center", "py-3", "justify-content-between", "border-top");
footerContainer.appendChild(footer);

// Create paragraph to hold the footer text
const footerText = document.createElement("p"); 
footerText.textContent = "© 2025 Sarah's Delicacies";  
footer.appendChild(footerText); 

}


export {backgroundFooter}; 