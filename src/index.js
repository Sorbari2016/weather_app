// ENTRY FILE

// Modular Imports
import homepage from "./module.js"
import { loadBookTab } from "./module2.js";
import { loadMenuTab } from "./module3.js";

// Styles & Framework imports
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'; 
import './styles.css';


// Clear the content area: 
function clearPageContent() {
    const content = document.getElementById("content"); 
      
    content.innerHTML = "";
}

// Remove the active class from all tab buttons
function clearActiveTab() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
}



function switchTabs() {
    // For the home button
    const homeTab = document.getElementById("homeTab"); 
    homeTab.addEventListener("click", function(e){
        e.preventDefault(); 
        clearPageContent(); 
        clearActiveTab();
        e.target.classList.add('active');
        homepage(); 
    }); 

    // For the Book button
    const bookTab = document.getElementById("bookTab"); 
    bookTab.addEventListener("click", function(e) {
        e.preventDefault(); 
        clearPageContent();
        clearActiveTab();
        e.target.classList.add('active'); 
        loadBookTab(); 
    }); 

    const menuTab = document.getElementById("menuTab"); 
    menuTab.addEventListener("click", function(e){
        e.preventDefault(); 
        clearPageContent();
        clearActiveTab();
        e.target.classList.add('active'); 
        loadMenuTab(); 
    })

}
  

// Run the homepage and swichtabs functions. 
homepage(); 
switchTabs(); 








