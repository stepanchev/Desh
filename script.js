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
// Глобальные события
// ==========================================
document.addEventListener("click", (e) => {
  const addTaskBtn = e.target.closest(".add-task-button");
  if (addTaskBtn) {
    const column = addTaskBtn.closest(".column");
    if (column) {
      openModalAddTask(column.dataset.columnId);
    }
    return;
  }

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
    if (typeof closeUserSelect === "function") closeUserSelect();
  }
});

// ==========================================
// ВАЛИДАЦИЯ И СОЗДАНИЕ ЗАДАЧИ
// ==========================================
taskTitleModal.addEventListener("input", () => {
  taskTitleModal.style.border = "";
});
taskDescriptionModal.addEventListener("input", () => {
  taskDescriptionModal.style.border = "";
});

function renderNewTask(name, description, columnId) {
  const taskContainer = document.querySelector(
    `.task-list[data-task-list="${columnId}"]`,
  );

  if (!taskContainer) {
    console.error("Контейнер для задач не найден. columnId:", columnId);
    return;
  }

  const emptyState = taskContainer.querySelector(".empty-column");
  if (emptyState) {
    emptyState.remove();
  }

  const newTaskCard = document.createElement("div");
  newTaskCard.className = "card-task";
  newTaskCard.innerHTML = `
    <div class="task-card-header">
      <div class="card-name-block">
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

submitButton.addEventListener("click", () => {
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

// ==========================================
// ДОБАВЛЕНИЕ КОЛОНОК И УВЕДОМЛЕНИЯ
// ==========================================
function showError(errorText) {
  // ИСПРАВЛЕНО: Правильная проверка на существование контейнера
  let container = document.getElementById("notificationContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "notificationContainer";
    container.className = "notification-container";
    document.body.appendChild(container);
  }

  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerHTML = `<span class="notification-message"> ${errorText} </span>`;

  container.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("removed");
  }, 5000);
  setTimeout(() => {
    notification.remove();
  }, 6000);
}

function AddingColumns() {
  const innerColumnsZone = document.getElementById("innerColumnsZone");
  const addColumnBtn = document.getElementById("add-column");

  if (!innerColumnsZone || !addColumnBtn) return;

  const currentColumnsCount =
    innerColumnsZone.querySelectorAll(".column").length;

  if (currentColumnsCount >= 5) {
    showError("Достигнут допустимый лимит колонок");
    return;
  }

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Название колонки...";
  input.className = addColumnBtn.className;
  input.style.cssText = `
    box-sizing: border-box;
    padding: 0px;
    border: 1px solid transparent;
    border-radius: 6px;
    font: inherit;
    width: 180px;
    background-color: transparent;
    outline: none;
    box-shadow: 0 0 0 transparent;
    color: #A0A0A0;
    display: flex;
    transition:
      width 0.4s cubic-bezier(0.22, 1, 0.36, 1),
      padding 0.3s ease,
      border-color 0.3s ease,
      background-color 0.3s ease,
      box-shadow 0.3s ease;
  `;

  addColumnBtn.replaceWith(input);

  requestAnimationFrame(() => {
    input.style.width = "320px";
    input.style.padding = "0px 10px";
    input.style.borderColor = "#555555";
    input.style.backgroundColor = "#FFFFFF";
    input.style.boxShadow = "0 3px 12px rgb(0 0 0 / 8%)";
  });

  input.focus();

  let finished = false;

  function finishCreatingColumn(save = true) {
    if (finished) return;
    finished = true;

    const columnTitle = input.value.trim() || "Новая таблица";
    input.replaceWith(addColumnBtn);

    if (!save) return;

    columnCounter++;
    const newColumnId = `col-${columnCounter}`;

    const newColumn = document.createElement("article");
    newColumn.className = "column";
    newColumn.dataset.columnId = newColumnId;

    newColumn.innerHTML = `
      <header class="column-header">
        <div class="column-title-block">
          <h4 class="column-title">${columnTitle}</h4>
        </div>
        <div class="header-buttons">
        <button class="add-task-button">
        <svg class="" width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.800049 5.46725H5.46725M5.46725 5.46725H10.1344M5.46725 5.46725V0.800049M5.46725 5.46725V10.1344" stroke-width="1.6" stroke-linecap="round" stroke="#737373"/>
        </svg>
        </button>
        <button class="button-redact-task" aria-label="redact">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 8.667C8.368 8.667 8.667 8.368 8.667 8 C8.667 7.632 8.368 7.333 8 7.333 C7.632 7.333 7.333 7.632 7.333 8 C7.333 8.368 7.632 8.667 8 8.667Z" stroke="#737373" stroke-width="1.6"/>
            <path d="M12.666 8.667C13.034 8.667 13.333 8.368 13.333 8 C13.333 7.632 13.034 7.333 12.666 7.333 C12.298 7.333 12 7.632 12 8 C12 8.368 12.298 8.667 12.666 8.667Z" stroke="#737373" stroke-width="1.6"/>
            <path d="M3.334 8.667C3.702 8.667 4 8.368 4 8 C4 7.632 3.702 7.333 3.334 7.333 C2.966 7.333 2.667 7.632 2.667 8 C2.667 8.368 2.966 8.667 3.334 8.667Z" stroke="#737373" stroke-width="1.6"/>
          </svg>
        </button>
        </div>
      </header>
      <div class="task-list" data-task-list="${newColumnId}">
        <div class="empty-column"> 
          <div>
            <img src="assets/image/inbox.png" alt="inbox">
          </div>
          <div class="empty-message"> 
            <p class="heading-message">Здесь пока нет задач</p>
            <p class="main-message">Добавьте первую карточку, чтобы начать работу</p>
          </div>
        </div>
      </div>
    `;

    innerColumnsZone.appendChild(newColumn);
  }

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      finishCreatingColumn();
    }
    if (event.key === "Escape") {
      finishCreatingColumn(false);
    }
  });

  input.addEventListener("blur", () => {
    finishCreatingColumn();
  });
}
