// script.js

// Initial Employee Records
const directory = [
  {
    id: 1,
    first: "Alice",
    last: "Johnson",
    email: "alice.j@company.com",
    dept: "HR",
    role: "Manager",
  },
  {
    id: 2,
    first: "Bob",
    last: "Smith",
    email: "bob.s@company.com",
    dept: "Finance",
    role: "Analyst",
  },
  {
    id: 3,
    first: "Charlie",
    last: "Brown",
    email: "charlie.b@company.com",
    dept: "Engineering",
    role: "Developer",
  },
  {
    id: 4,
    first: "Diana",
    last: "Miller",
    email: "diana.m@company.com",
    dept: "Marketing",
    role: "Coordinator",
  },
  {
    id: 5,
    first: "Ethan",
    last: "Lee",
    email: "ethan.l@company.com",
    dept: "Sales",
    role: "Representative",
  },
  {
    id: 6,
    first: "Fiona",
    last: "Davis",
    email: "fiona.d@company.com",
    dept: "HR",
    role: "Recruiter",
  },
  {
    id: 7,
    first: "George",
    last: "Wilson",
    email: "george.w@company.com",
    dept: "Finance",
    role: "Clerk",
  },
  {
    id: 8,
    first: "Hannah",
    last: "Taylor",
    email: "hannah.t@company.com",
    dept: "Engineering",
    role: "Intern",
  },
  {
    id: 9,
    first: "Ivan",
    last: "Martinez",
    email: "ivan.m@company.com",
    dept: "Marketing",
    role: "Strategist",
  },
  {
    id: 10,
    first: "Jane",
    last: "Garcia",
    email: "jane.g@company.com",
    dept: "Sales",
    role: "Executive",
  },
];

// State Variables
let records = [...directory];
let pageIndex = 1;
let itemsPerPage = 5;
let sortBy = "first";
let direction = "asc";
let searchParams = { text: "" };
let tempID = null;

// DOM Elements
const listContainer = document.getElementById("employeeCards");
const searchBox = document.getElementById("searchText");
const searchBtn = document.getElementById("btnSearch");
const sortSelect = document.getElementById("sortMenu");
const pageSelect = document.getElementById("pageLimit");
const btnPrev = document.getElementById("goPrev");
const btnNext = document.getElementById("goNext");
const pageLabel = document.getElementById("pageDisplay");
const formModal = document.getElementById("entryModal");
const removeModal = document.getElementById("removeModal");
const addNewBtn = document.getElementById("addEmployeeBtn");
const confirmRemoveBtn = document.getElementById("confirmRemove");

// Form Inputs
const empId = document.getElementById("empId");
const fname = document.getElementById("firstName");
const lname = document.getElementById("lastName");
const email = document.getElementById("email");
const dept = document.getElementById("department");
const role = document.getElementById("position");

document.addEventListener("DOMContentLoaded", () => {
  showList();
  registerEvents();
});

function registerEvents() {
  searchBtn.addEventListener("click", executeSearch);
  searchBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") executeSearch();
  });

  sortSelect.addEventListener("change", handleSort);
  pageSelect.addEventListener("change", () => {
    itemsPerPage = parseInt(pageSelect.value);
    pageIndex = 1;
    showList();
  });

  btnPrev.addEventListener("click", () => {
    if (pageIndex > 1) {
      pageIndex--;
      showList();
    }
  });

  btnNext.addEventListener("click", () => {
    const total = filterData(records).length;
    if (pageIndex < Math.ceil(total / itemsPerPage)) {
      pageIndex++;
      showList();
    }
  });

  addNewBtn.addEventListener("click", openAddForm);
  formModal.addEventListener("submit", handleSubmit);

  document.querySelectorAll(".modal-dismiss").forEach((btn) => {
    btn.addEventListener("click", closeModals);
  });

  listContainer.addEventListener("click", (e) => {
    if (e.target.closest(".edit-action")) {
      const id = +e.target.closest(".edit-action").dataset.id;
      loadEditForm(id);
    }
    if (e.target.closest(".delete-action")) {
      const id = +e.target.closest(".delete-action").dataset.id;
      triggerRemove(id);
    }
  });

  confirmRemoveBtn.addEventListener("click", removeEntry);
}

function showList() {
  const filtered = filterData(records);
  const sorted = sortEntries(filtered);
  const paginated = paginateData(sorted);

  listContainer.innerHTML = "";

  if (paginated.length === 0) {
    listContainer.innerHTML = `<p class="empty">No matching employees.</p>`;
    updatePaginationDisplay(0);
    return;
  }

  paginated.forEach((emp) => {
    const card = document.createElement("div");
    card.className = "card-item";
    card.innerHTML = `
      <div class="card-info">
        <h4>${emp.first} ${emp.last}</h4>
        <p>${emp.email}</p>
        <p>${emp.dept} - ${emp.role}</p>
      </div>
      <div class="card-actions">
        <button class="edit-action" data-id="${emp.id}">Edit</button>
        <button class="delete-action" data-id="${emp.id}">Delete</button>
      </div>
    `;
    listContainer.appendChild(card);
  });

  updatePaginationDisplay(filtered.length);
}

function filterData(data) {
  return data.filter((emp) => {
    const textMatch = `${emp.first} ${emp.last} ${emp.email}`
      .toLowerCase()
      .includes(searchParams.text.toLowerCase());
    return textMatch;
  });
}

function handleSort() {
  const [key, dir] = sortSelect.value.split("-");
  sortBy = key;
  direction = dir;
  showList();
}

function sortEntries(data) {
  return [...data].sort((a, b) => {
    const aVal = a[sortBy].toString().toLowerCase();
    const bVal = b[sortBy].toString().toLowerCase();
    if (direction === "asc") return aVal > bVal ? 1 : -1;
    else return bVal > aVal ? 1 : -1;
  });
}

function paginateData(data) {
  const start = (pageIndex - 1) * itemsPerPage;
  return data.slice(start, start + itemsPerPage);
}

function updatePaginationDisplay(total) {
  const pages = Math.ceil(total / itemsPerPage);
  pageLabel.textContent = pages ? `Page ${pageIndex} of ${pages}` : "No Data";
  btnPrev.disabled = pageIndex === 1;
  btnNext.disabled = pageIndex === pages || pages === 0;
}

function executeSearch() {
  searchParams.text = searchBox.value.trim();
  pageIndex = 1;
  showList();
}

function openAddForm() {
  formModal.reset();
  empId.value = "";
  document.getElementById("formHeader").textContent = "Add Employee";
  formModal.classList.add("open");
}

function loadEditForm(id) {
  const emp = records.find((r) => r.id === id);
  if (!emp) return;

  empId.value = emp.id;
  fname.value = emp.first;
  lname.value = emp.last;
  email.value = emp.email;
  dept.value = emp.dept;
  role.value = emp.role;

  document.getElementById("formHeader").textContent = "Edit Employee";
  formModal.classList.add("open");
}

function closeModals() {
  document
    .querySelectorAll(".modal")
    .forEach((m) => m.classList.remove("open"));
}

function handleSubmit(e) {
  e.preventDefault();
  const formObj = {
    id: empId.value ? parseInt(empId.value) : null,
    first: fname.value.trim(),
    last: lname.value.trim(),
    email: email.value.trim(),
    dept: dept.value.trim(),
    role: role.value.trim(),
  };

  const emailDuplicate = records.some(
    (emp) =>
      emp.email.toLowerCase() === formObj.email.toLowerCase() &&
      (!formObj.id || emp.id !== formObj.id)
  );

  if (emailDuplicate) {
    alert("Email must be unique.");
    return;
  }

  if (formObj.id) {
    const idx = records.findIndex((emp) => emp.id === formObj.id);
    if (idx !== -1) records[idx] = formObj;
  } else {
    formObj.id = records.length
      ? Math.max(...records.map((emp) => emp.id)) + 1
      : 1;
    records.push(formObj);
  }

  closeModals();
  showList();
}

function triggerRemove(id) {
  tempID = id;
  removeModal.classList.add("open");
}

function removeEntry() {
  if (tempID !== null) {
    records = records.filter((emp) => emp.id !== tempID);
    tempID = null;
    closeModals();
    showList();
  }
}
