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
  renderNewTask(taskName, taskDescription, currentTargetColumnId);

  taskTitleModal.value = "";
  taskDescriptionModal.value = "";

  closeModalAddTask();
});

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
  input.innerHTML = input.style.cssText = `
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
dispaly: flex;

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
          <h4 class="column-title"></h4>
        </div>
        <button class="button-redact-task" aria-label="redact">
          <svg width="16" height="16" viewBox="0 0 16 16"
               fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 8.667C8.368 8.667 8.667 8.368 8.667 8
              C8.667 7.632 8.368 7.333 8 7.333
              C7.632 7.333 7.333 7.632 7.333 8
              C7.333 8.368 7.632 8.667 8 8.667Z"
              stroke="#737373" stroke-width="1.6"/>
            <path d="M12.666 8.667C13.034 8.667 13.333 8.368 13.333 8
              C13.333 7.632 13.034 7.333 12.666 7.333
              C12.298 7.333 12 7.632 12 8
              C12 8.368 12.298 8.667 12.666 8.667Z"
              stroke="#737373" stroke-width="1.6"/>
            <path d="M3.334 8.667C3.702 8.667 4 8.368 4 8
              C4 7.632 3.702 7.333 3.334 7.333
              C2.966 7.333 2.667 7.632 2.667 8
              C2.667 8.368 2.966 8.667 3.334 8.667Z"
              stroke="#737373" stroke-width="1.6"/>
          </svg>
        </button>
      </header>
      <div class="task-list" data-task-list="${newColumnId}"></div>
    `;

    newColumn.querySelector(".column-title").textContent = columnTitle;

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
