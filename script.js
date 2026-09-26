const addTask = document.getElementById("addTaskButton");
const closeModalTaskButton = document.getElementById("closeModalAddTask");
const modalOverlay = document.getElementById("modalOverlay");
const cancelButtonModal = document.getElementById("cancelButtonModal");

function openModalAddTask() {
  modalOverlay.classList.toggle("active");
}

function closeModalAddTask() {
  modalOverlay.classList.remove("active");
}

addTask.addEventListener("click", () => {
  openModalAddTask();
});

closeModalTaskButton.addEventListener("click", () => {
  closeModalAddTask();
});

cancelButtonModal.addEventListener("click", () => {
  closeModalAddTask();
});

let taskTitleModal = document.getElementById("task-title") ;
let taskDescriptionModal = document.getElementById("task-description") ;
let taskkDeadlineModal = document.getElementById("task-deadline");

function validation() {
  if (taskTitleModal.value.trim() === "")  {
    taskTitleModal.style.border = "2px solid red";
    return;
  } else if (taskDescriptionModal.value.trim() === "") {
    taskDescriptionModal.style.border = "2px solid red";
    return;
  } else {
    renderNewTask();
    closeModalAddTask();
  }
}
taskTitleModal.addEventListener("input", () => {
  taskTitleModal.style.border = "";
});

taskDescriptionModal.addEventListener("input", () => {
  taskDescriptionModal.style.border = "";
});


const userSelect = document.getElementById("userSelect");
const userSelectToggle = document.getElementById("userSelectToggle");
const nativeAssigneeSelect = document.getElementById("task-assignee");

const PERSON_SVG = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V19C4 19.55 4.45 20 5 20H19C19.55 20 20 19.55 20 19V18C20 15.34 14.67 14 12 14Z"/>
  </svg>`;

function openUserSelect() {
  userSelect.classList.add("open");
  userSelectToggle.setAttribute("aria-expanded", "true");
}

function closeUserSelect() {
  userSelect.classList.remove("open");
  userSelectToggle.setAttribute("aria-expanded", "false");
}

function updateUserSelectValue(value) {
  const option = nativeAssigneeSelect.querySelector(
    `option[value="${CSS.escape(value)}"]`,
  );
  const toggleAvatar = userSelectToggle.querySelector(".user-select-avatar");
  const toggleName = userSelectToggle.querySelector(".user-select-name");

  if (option && option.value !== "") {
    toggleAvatar.classList.remove("empty");
    toggleAvatar.innerHTML = PERSON_SVG;
    toggleName.textContent = option.textContent.trim();
  } else {
    toggleAvatar.classList.add("empty");
    toggleAvatar.innerHTML = PERSON_SVG;
    toggleName.textContent = "Не выбран";
  }

  userSelect.querySelectorAll(".user-select-option").forEach((li) => {
    li.classList.toggle("selected", li.dataset.value === value);
  });
}

if (nativeAssigneeSelect && userSelect) {
  userSelect.querySelectorAll(".user-select-option").forEach((li) => {
    const opt = document.createElement("option");
    opt.value = li.dataset.value;
    opt.textContent = li.querySelector(".user-select-name").textContent.trim();
    nativeAssigneeSelect.appendChild(opt);
  });

  userSelectToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    userSelect.classList.contains("open")
      ? closeUserSelect()
      : openUserSelect();
  });

  userSelect.addEventListener("click", (e) => {
    const option = e.target.closest(".user-select-option");
    if (!option) return;
    nativeAssigneeSelect.value = option.dataset.value;
    nativeAssigneeSelect.dispatchEvent(new Event("change"));
    updateUserSelectValue(option.dataset.value);
    closeUserSelect();
  });

  document.addEventListener("click", (e) => {
    if (!userSelect.contains(e.target)) closeUserSelect();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeUserSelect();
  });

  updateUserSelectValue(nativeAssigneeSelect.value);
}

function renderNewTask() {

  let taskName = taskTitleModal.value;
  let taskDescription = taskDescriptionModal.value;
  let taskDeveloperName = userSelectToggle
    .querySelector(".user-select-name")
    .textContent.trim();
  console.log(taskName, taskDescription, taskDeveloperName);
}

const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", () => {
  validation();
});
