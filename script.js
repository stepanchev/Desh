const modalOverlay = document.getElementById("modalOverlay");
const closeModalTaskButton = document.getElementById("closeModalAddTask");
const cancelButtonModal = document.getElementById("cancelButtonModal");
const submitButton = document.getElementById("submitButton");

const taskTitleModal = document.getElementById("task-title");
const taskDescriptionModal = document.getElementById("task-description");
const taskkDeadlineModal = document.getElementById("task-deadline");
const nativeAssigneeSelect = document.getElementById("task-assignee");

const userSelect = document.getElementById("userSelect");
const userSelectToggle = document.getElementById("userSelectToggle");

let currentTargetColumnId = null;
let columnCounter = 0;

const PERSON_SVG = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V19C4 19.55 4.45 20 5 20H19C19.55 20 20 19.55 20 19V18C20 15.34 14.67 14 12 14Z"/>
  </svg>`;

// ==========================================
// Модалка
// ==========================================
function openModalAddTask(columnId) {
  currentTargetColumnId = columnId;
  modalOverlay.classList.add("active");
}

function closeModalAddTask() {
  modalOverlay.classList.remove("active");
  currentTargetColumnId = null;
}

// ==========================================

document.addEventListener("click", (e) => {
  const addTaskBtn = e.target.closest(".button-redact-task, .column-add-card");
  if (addTaskBtn) {
    const column = addTaskBtn.closest(".column");
    if (column) {
      openModalAddTask(column.dataset.columnId);
    }
    return;
  }

  //Закрытие модалки
  if (
    e.target === modalOverlay ||
    e.target === closeModalTaskButton ||
    e.target === cancelButtonModal
  ) {
    closeModalAddTask();
  }

  const addColumnBtn = e.target.closest("#add-column");
  if (addColumnBtn) {
    AddingColumns();
    return;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModalAddTask();
    closeUserSelect();
  }
});

// ВАЛИДАЦИЯ И СОЗДАНИЕ ЗАДАЧИ
// ==========================================
taskTitleModal.addEventListener("input", () => {
  taskTitleModal.style.border = "";
});
taskDescriptionModal.addEventListener("input", () => {
  taskDescriptionModal.style.border = "";
});

submitButton.addEventListener("click", () => {
  // Валидация
  if (taskTitleModal.value.trim() === "") {
    taskTitleModal.style.border = "2px solid red";
    return;
  }
  if (taskDescriptionModal.value.trim() === "") {
    taskDescriptionModal.style.border = "2px solid red";
    return;
  }

  const taskName = taskTitleModal.value.trim();
  const taskDescription = taskDescriptionModal.value.trim();

  renderNewTask(taskName, taskDescription, currentTargetColumnId);

  taskTitleModal.value = "";
  taskDescriptionModal.value = "";

  closeModalAddTask();
});

function renderNewTask(name, description, columnId) {
  const taskContainer = document.querySelector(
    `.task-list[data-task-list="${columnId}"]`,
  );

  if (!taskContainer) {
    console.error("Контейнер для задач не найден. columnId:", columnId);
    return;
  }

  const newTaskCard = document.createElement("div");
  newTaskCard.className = "card-task";
  newTaskCard.innerHTML = `
    <div class="task-card-header">
      <div class="card-name-block">
        <div class="column-color-dot"></div>
        <h5 class="task-name">${name}</h5>
      </div>
      <span class="edit-task-icon" style="cursor: pointer; opacity: 0; transition: opacity 0.2s;">
        <svg width="12" height="12" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.442 1.707a1.21 1.21 0 011.71 0l1.142 1.14a1.21 1.21 0 010 1.711l-.856.856-2.852-2.852.856-.855zM9.31 3.839L3.164 9.985l-.91 3.714 3.761-.863 6.146-6.146L9.31 3.84z" fill="#8b8b8b"></path>
        </svg> 
      </span>
    </div>
    <div class="task-card-body">
      <p class="task-description">${description}</p>
    </div>
  `;
  newTaskCard.addEventListener("mouseenter", () => {
    newTaskCard.querySelector(".edit-task-icon").style.opacity = "1";
  });
  newTaskCard.addEventListener("mouseleave", () => {
    newTaskCard.querySelector(".edit-task-icon").style.opacity = "0";
  });

  taskContainer.appendChild(newTaskCard);
}

// ==========================================
//  ДОБАВЛЕНИЕ КОЛОНОК
// ==========================================
function showError(errorText) {
  let ErrorConteiner = document.createElement("div");
  if (!ErrorConteiner) {
    ErrorConteiner = document.createElement("div");
    ErrorConteiner.id = "notificationContainer";
    ErrorConteiner.className = "notification-container";
    document.body.appendChild(ErrorConteiner);
  }
  ErrorConteiner.id = "notificationContainer";
  const notification = document.createElement("div");
  notification.className = "notification";

  notification.innerHTML = `
  <span class="notification-message"> ${errorText} </span>
  `;
  ErrorConteiner.appendChild(notification);
  document.body.appendChild(ErrorConteiner);
  setTimeout(() => {
    notification.classList.add("removed");
  }, 5000);
  setTimeout(() => {
    notification.remove();
  }, 6000);
}
function AddingColumns() {
  columnCounter++;
  const innerColumnsZone = document.getElementById("innerColumnsZone");
  if (!innerColumnsZone) return;
  let currentColumnsCount = innerColumnsZone.querySelectorAll(".column").length;
  const newColumnId = `col-${columnCounter}`;

  //=========================================
  //Запрос на имя колонки у пользователя
  //=========================================

  let userColumnTitle = prompt();
  let columnTitle = userColumnTitle || null;

  if (currentColumnsCount >= 5) {
    showError("Достигнут допустимый лимит колонок");
    return;
  }
  const newColumn = `
    <article class="column" data-column-id="${newColumnId}">
      <header class="column-header">
        <div class="column-title-block">
          <h4 class="column-title">${columnTitle ?? "новая колонка"}</h4>
        </div>
        <button class="button-redact-task" aria-label="redact">
         <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.00004 8.66719C8.36819 8.66719 8.66664 8.36848 8.66664 7.99999C8.66664 7.63151 8.36819 7.33279 8.00004 7.33279C7.63188 7.33279 7.33344 7.63151 7.33344 7.99999C7.33344 8.36848 7.63188 8.66719 8.00004 8.66719Z" stroke="#737373" stroke-width="1.6" stroke-linecap="round"/>
<path d="M12.6662 8.66719C13.0344 8.66719 13.3328 8.36848 13.3328 7.99999C13.3328 7.63151 13.0344 7.33279 12.6662 7.33279C12.2981 7.33279 11.9996 7.63151 11.9996 7.99999C11.9996 8.36848 12.2981 8.66719 12.6662 8.66719Z" stroke="#737373" stroke-width="1.6" stroke-linecap="round"/>
<path d="M3.33384 8.66719C3.70199 8.66719 4.00044 8.36848 4.00044 7.99999C4.00044 7.63151 3.70199 7.33279 3.33384 7.33279C2.96568 7.33279 2.66724 7.63151 2.66724 7.99999C2.66724 8.36848 2.96568 8.66719 3.33384 8.66719Z" stroke="#737373" stroke-width="1.6" stroke-linecap="round"/>
</svg>

        </button>
      </header>
      <div class="task-list" data-task-list="${newColumnId}">
        <!-- задачи -->
      </div>
      <footer class="column-footer">
      </footer>
    </article>
  `;
  innerColumnsZone.insertAdjacentHTML("beforeend", newColumn);
}
