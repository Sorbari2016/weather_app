// BOOK TAB CODES

import { backgroundFooter } from "./javascript.js";


function loadBookTab() {
  const content = document.getElementById("content");

  function bookContent() {
    const bodyContainer = document.createElement("div");
    bodyContainer.classList.add("container","bookcontainer");
    content.appendChild(bodyContainer);

    bodyContainer.innerHTML = `
      <form id="bookingForm">
        <h3> Reserve Your Table</h3>
        <hr/>
        <p>
          <label>Name</label>
          <input type="text" name="name" required>
        </p>

        <p>
          <label>Email</label>
          <input type="email" name="email" required>
        </p>
        
        <p>
          <label>Phone Number</label>
          <input type="tel" name="phone" required>
        </p>

        <p>
          <label>Number of Guests</label>
          <input type="number" name="guests" required>
        </p>

        <p>
          <label>Special Note:</label>
          <textarea name="note"></textarea>
        </p>

        
        <button type="submit">Submit</button>
    
      </form>
    `;

    bodyContainer.style.backgroundColor = "#F5EFFF"; 

    backgroundFooter();

    const form = document.getElementById("bookingForm");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Form submitted!");
      form.reset();
    });
  }

  bookContent();
}



export {loadBookTab}; 





         
