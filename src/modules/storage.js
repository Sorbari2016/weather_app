// Create method to save list to local storage
const saveToLocalStorage = (lists) => {
  try {
    localStorage.setItem("lists", JSON.stringify(lists));
  } catch (error) {
    console.error("Failed to save list to local storage", error);
  }
};

// Create method to retrieve saved lists
const loadFromLocalStorage = () => {
  try {
    const storedLists = localStorage.getItem("lists");

    // check if any list is stored
    if (!storedLists) {
      return [];
    }

    // retrieve
    return JSON.parse(storedLists);
  } catch (error) {
    console.error("Failed to retreive lists", error);
  }
};

export { saveToLocalStorage, loadFromLocalStorage };
