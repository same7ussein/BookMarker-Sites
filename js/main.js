// DOM Elements
const siteNameInput = document.getElementById("siteName");
const siteUrlInput = document.getElementById("siteUrl");
const addBtn = document.getElementById("AddBtn");
const modal = document.getElementById("exampleModal");
const tableElement = document.getElementById("example");
const nameErrorMessage = document.getElementById("nameMessage");
const emailErrorMessage = document.getElementById("emailMessage");

// DataTable Initialization
const dataTable = new DataTable(tableElement, {
  responsive: true,
  searching: true,
  columnDefs: [{ targets: [0, 2, 3], searchable: false }],
});

// Local Storage and Update Flags
const siteList = JSON.parse(localStorage.getItem("sites")) || [];
let selectedIndex;
let isUpdateMode = false;

// Regular Expressions for Validation
const nameRegex = /^[A-Za-z]\w{5,15}$/;
const urlRegex =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!-)[A-Z\d-]{1,63}(?<!-)\.?)+\w{2,6}(?::\d{1,5})?(?:[/?#]\S*)?$/i;

// Update Item Function
function updateItem(index) {
  isUpdateMode = true;
  selectedIndex = index;
  siteNameInput.value = siteList[index].siteName;
  siteUrlInput.value = siteList[index].siteUrl;
  addBtn.textContent = "Update Site";
  siteNameInput.classList.remove("is-invalid");
  siteUrlInput.classList.remove("is-invalid");
  siteNameInput.classList.add("is-valid");
  siteUrlInput.classList.add("is-valid");
  nameErrorMessage.classList.add("d-none");
  emailErrorMessage.classList.add("d-none");
}

// Add Site Function
function addSite() {
  if (
    validateInput(siteNameInput, nameRegex, nameErrorMessage) &&
    validateInput(siteUrlInput, urlRegex, emailErrorMessage)
  ) {
    const newSite = {
      siteName: siteNameInput.value,
      siteUrl: siteUrlInput.value,
    };

    if (isUpdateMode) {
      siteList[selectedIndex] = newSite;
      isUpdateMode = false;
    } else {
      siteList.push(newSite);
    }

    localStorage.setItem("sites", JSON.stringify(siteList));
    resetForm();
    siteNameInput.classList.remove("is-valid");
    siteUrlInput.classList.remove("is-valid");
  }
}

// Display Table Function
function displayTable() {
  dataTable.clear();
  for (let i = 0; i < siteList.length; i++) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${i}</td>
        <td>${siteList[i].siteName}</td>
        <td>
          <a href="${siteList[i].siteUrl}" target="_blank" class="btn btn-success"><i class="fa-solid fa-eye"></i> Visit</a>
        </td>
        <td>
          <button class="btn btn-primary" onclick="updateItem(${i})"><i class="fa-regular fa-pen-to-square"></i> Update</button>
          <button class="btn btn-danger" onclick="deleteItemConfirmation(${i})" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-trash"></i> Delete</button>
        </td>
      `;
    dataTable.row.add(newRow);
  }

  dataTable.draw();
}

// Reset Form Function
function resetForm() {
  siteNameInput.value = "";
  siteUrlInput.value = "";
}

// Delete Item Confirmation Function
function deleteItemConfirmation(index) {
  selectedIndex = index;
}

// Delete Item Function
function deleteItem() {
  siteList.splice(selectedIndex, 1);
  localStorage.setItem("sites", JSON.stringify(siteList));
  displayTable();
  resetForm();
  if (addBtn.textContent === "Update Site") {
    addBtn.textContent = "Add Site";
  }
}

// Initial Table Display
displayTable();

// Input Validation Function
function validateInput(element, regex, messageElement) {
  const isValid = regex.test(element.value);
  updateValidationStatus(element, isValid, messageElement);
  return isValid;
}

// Update Validation Status Function
function updateValidationStatus(element, isValid, messageElement) {
  if (isValid) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    messageElement.classList.add("d-none");
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
    messageElement.classList.remove("d-none");
  }
}

// Event Listeners
addBtn.addEventListener("click", function () {
  if (
    validateInput(siteNameInput, nameRegex, nameErrorMessage) &&
    validateInput(siteUrlInput, urlRegex, emailErrorMessage)
  ) {
    addSite();
    displayTable();
    addBtn.textContent = "Add Site";
  }
});

siteNameInput.addEventListener("input", function () {
  validateInput(siteNameInput, nameRegex, nameErrorMessage);
});

siteUrlInput.addEventListener("input", function () {
  validateInput(siteUrlInput, urlRegex, emailErrorMessage);
});
