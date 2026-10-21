const modalOverlay = document.getElementById("modalOverlay");
const closeModalTaskButton = document.getElementById("closeModalAddTask");
const cancelButtonModal = document.getElementById("cancelButtonModal");
const submitButton = document.getElementById("submitButton");

const taskTitleModal = document.getElementById("task-title");
const taskDescriptionModal = document.getElementById("task-description");

let currentTargetColumnId = null;
let columnCounter = 0;

// ==========================================
// Модалка добавления задачи
// ==========================================
function openModalAddTask(columnId) {
  currentTargetColumnId = columnId;
  modalOverlay.classList.add("active");
}

function closeModalAddTask() {
  modalOverlay.classList.remove("active");
  currentTargetColumnId = null;
  taskTitleModal.style.border = "";
  taskDescriptionModal.style.border = "";
}

// ==========================================
// Меню колонки (появляется возле кнопки «⋯»)
// ==========================================
let columnMenu = null; // сам блок меню
let columnMenuButton = null; // кнопка, которой меню открыто

function closeColumnMenu() {
  if (columnMenu) {
    columnMenu.remove();
  }
  columnMenu = null;
  columnMenuButton = null;
}
function deletionRequest(column) {
  // не плодим несколько окон подтверждения
  document.querySelector(".request-deleted")?.remove();

  const columnTitle = column.querySelector(".column-title").textContent;

  const requestDiv = document.createElement("div");
  requestDiv.className = "request-deleted";

  const text = document.createElement("p");
  text.textContent = `Вы действительно хотите удалить колонку «${columnTitle}»?`;

  const confirmBtn = document.createElement("button");
  confirmBtn.type = "button";
  confirmBtn.textContent = "Удалить";
  confirmBtn.addEventListener("click", () => {
    column.remove();
    requestDiv.remove();
  });

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.textContent = "Отмена";
  cancelBtn.addEventListener("click", () => requestDiv.remove());

  requestDiv.append(text, confirmBtn, cancelBtn);
  document.body.append(requestDiv);
  return requestDiv;
}
function openColumnMenu(button) {
  closeColumnMenu();

  const column = button.closest(".column");
  if (!column) return;

  const menu = document.createElement("div");
  menu.className = "column-menu";
  Object.assign(menu.style, {
    position: "fixed",
    zIndex: "1000",
    minWidth: "160px",
    padding: "6px",
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  });

  const deleteItem = document.createElement("button");
  deleteItem.type = "button";
  deleteItem.className = "column-menu-item";
  deleteItem.textContent = "Удалить колонку";
  Object.assign(deleteItem.style, {
    display: "block",
    width: "100%",
    padding: "8px 10px",
    border: "none",
    borderRadius: "6px",
    background: "transparent",
    color: "#d93025",
    font: "inherit",
    textAlign: "left",
    cursor: "pointer",
    textAlign: "start",
  });
  deleteItem.addEventListener("mouseenter", () => {
    deleteItem.style.background = "#f5f5f5";
  });
  deleteItem.addEventListener("mouseleave", () => {
    deleteItem.style.background = "transparent";
  });

deleteItem.addEventListener("click", () => {
  deletionRequest(column); 
  closeColumnMenu();
});

  const changeTitle = document.createElement("button");
  changeTitle.type = "button";
  changeTitle.className = "column-menu-item";
  changeTitle.textContent = "Изменить название";
  Object.assign(changeTitle.style, {
    display: "block",
    width: "100%",
    padding: "8px 10px",
    border: "none",
    borderRadius: "6px",
    background: "transparent",
    color: "#8d8d8d",
    font: "inherit",
    textAlign: "left",
    cursor: "pointer",
    textAlign: "center",
  });
  changeTitle.addEventListener("mouseenter", () => {
    changeTitle.style.background = "#f5f5f5";
  });
  changeTitle.addEventListener("mouseleave", () => {
    changeTitle.style.background = "transparent";
  });
  menu.append(changeTitle, deleteItem);
  document.body.append(menu);

  const rect = button.getBoundingClientRect();
  let left = rect.right + 8;
  if (left + menu.offsetWidth > window.innerWidth - 8) {
    left = rect.left - menu.offsetWidth - 8;
  }
  let top = rect.top;
  if (top + menu.offsetHeight > window.innerHeight - 8) {
    top = window.innerHeight - menu.offsetHeight - 8;
  }
  menu.style.left = Math.max(8, left) + "px";
  menu.style.top = Math.max(8, top) + "px";

  columnMenu = menu;
  columnMenuButton = button;
}

window.addEventListener("resize", closeColumnMenu);
window.addEventListener("scroll", closeColumnMenu, true);

// ==========================================
// Глобальные события
// ==========================================
document.addEventListener("click", (e) => {
  // 1. Кнопка «⋯» - открыть/закрыть меню
  const redactBtn = e.target.closest(".button-redact-task");
  if (redactBtn) {
    if (columnMenuButton === redactBtn) {
      closeColumnMenu();
    } else {
      openColumnMenu(redactBtn);
    }
    return;
  }

  // 2. Клик вне меню - закрыть его
  if (columnMenu && !columnMenu.contains(e.target)) {
    closeColumnMenu();
  }

  // 3. Кнопка добавления задачи
  const addTaskBtn = e.target.closest(".add-task-button");
  if (addTaskBtn) {
    const column = addTaskBtn.closest(".column");
    if (column) {
      openModalAddTask(column.dataset.columnId);
    }
    return;
  }

  // 4. Закрытие модалки (closest, чтобы работал клик по иконке внутри кнопки)
  if (
    e.target === modalOverlay ||
    e.target.closest("#closeModalAddTask") ||
    e.target.closest("#cancelButtonModal")
  ) {
    closeModalAddTask();
    return;
  }

  // 5. Добавление колонки
  if (e.target.closest("#add-column")) {
    AddingColumns();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeColumnMenu();
    closeModalAddTask();
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

  // Разметка без пользовательского текста
  const newTaskCard = document.createElement("div");
  newTaskCard.className = "card-task";
  newTaskCard.innerHTML = `
    <div class="task-card-header">
      <div class="card-name-block">
        <h5 class="task-name"></h5>
      </div>
      <span class="edit-task-icon" style="cursor: pointer; opacity: 0; transition: opacity 0.2s;">
        <svg width="12" height="12" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.442 1.707a1.21 1.21 0 011.71 0l1.142 1.14a1.21 1.21 0 010 1.711l-.856.856-2.852-2.852.856-.855zM9.31 3.839L3.164 9.985l-.91 3.714 3.761-.863 6.146-6.146L9.31 3.84z" fill="#8b8b8b"></path>
        </svg>
      </span>
    </div>
    <div class="task-card-body">
      <p class="task-description"></p>
    </div>
  `;

  // Пользовательский текст вставляем через textContent (защита от XSS)
  newTaskCard.querySelector(".task-name").textContent = name;
  newTaskCard.querySelector(".task-description").textContent = description;

  const editIcon = newTaskCard.querySelector(".edit-task-icon");
  newTaskCard.addEventListener("mouseenter", () => {
    editIcon.style.opacity = "1";
  });
  newTaskCard.addEventListener("mouseleave", () => {
    editIcon.style.opacity = "0";
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
  let container = document.getElementById("notificationContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "notificationContainer";
    container.className = "notification-container";
    document.body.appendChild(container);
  }

  const notification = document.createElement("div");
  notification.className = "notification";

  const message = document.createElement("span");
  message.className = "notification-message";
  message.textContent = errorText;
  notification.appendChild(message);

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
          <h4 class="column-title"></h4>
        </div>
        <div class="header-buttons">
          <button class="add-task-button" aria-label="add task">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
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
