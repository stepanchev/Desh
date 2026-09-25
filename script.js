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
