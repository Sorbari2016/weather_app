// MENU TAB

import { backgroundFooter } from "./javascript.js";

import friedRiceImg from '../assets/fried_rice.jpg';
import appetizersImg from '../assets/appetisers.jpg';
import smoothie from '../assets/cool_smoothie.jpg'; 
  

function loadMenuTab() {
    const bodyContainer = document.createElement("div"); 
    bodyContainer.classList.add("container", "menucontainer"); 
    content.appendChild(bodyContainer);

    bodyContainer.innerHTML = `
        <h1 class ="menuHeading">Food Menu</h1>
        <h4> Sarah's Delicacies</h4>
        <hr/>
        <div class = "row">
            <div class = "col">
                <div class = "card">
                    <h3> Main Course </h3> 
                    <hr/>
                    <div class="menu_list_item">
                        <span class = "item">Fried rice</span>
                        <span class = "price">₦7,000.</span>
                        <span class = "item">Spicey Chicken</span>
                        <span class = "price">₦5,000.</span>
                        <span class = "item">Deep Bake Goose</span>
                        <span class = "price">₦6,000. </span>
                    </div>
                </div>      
                
            </div>    
            <div class = "col">
                <div class = "placard">
                    <img src = "${friedRiceImg}" alt = "fried rice picture">
                </div>
            </div>    
        </div>

        <div class = "row">
            <div class = "col">
                <div class = "card">
                    <h3> Appetizers </h3> 
                    <hr/>
                    <div class="menu_list_item">
                        <span class = "item">Chicken Pie</span>
                        <span class = "price">₦4,500.</span>
                        <span class = "item">Vegetable Salad</span>
                        <span class = "price">₦3,000.</span>
                        <span class = "item">Spaghetti Pasta</span>
                        <span class = "price">₦5,000. </span>
                    </div>
                </div>
            </div>
            <div class = "col">
                <div class = "placard">
                    <img src = "${appetizersImg}" alt = "fried rice picture">
                </div>
            </div>
        </div>

        <div class = "row">
            <div class = "col">
                <div class = "card">
                    <h3> Drinks </h3> 
                    <hr/>
                    <div class="menu_list_item">
                        <span class = "item">Lemonade</span>
                        <span class = "price">₦13,000.</span>
                        <span class = "item">Smoothie</span>
                        <span class = "price">₦8,000.</span>
                        <span class = "item">Fresh Juice</span>
                        <span class = "price">₦4,000. </span>
                    </div>
                </div>
            </div>
            <div class = "col">
                <div class = "placard">
                    <img src = "${smoothie}" alt = "fried rice picture">
                </div>
            </div>
        </div>
        <div class = "row">
            <div class = "col">
                <div class = "menuInfo">
                    <p>+2347036897471 </p>
                    <p>www.sarah'delicacy.com<p>
                </div>
            </div>
            <div class = "col"></div>

        </div>
        `;

    backgroundFooter(); 
    bodyContainer.style.backgroundColor = "#F5EFFF"; 

}   




        


export {loadMenuTab}; 

