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

let taskTitleModal = document.getElementById("task-title");
let taskDescriptionModal = document.getElementById("task-description");
let taskkDeadlineModal = document.getElementById("task-deadline");

function validation() {
  if (taskTitleModal.value.trim() === "") {
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

function renderNewTask() {
  let taskName = taskTitleModal.value;
  let taskDescription = taskDescriptionModal.value;
  console.log(taskName, taskDescription);
}

const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", () => {
  validation();
});
