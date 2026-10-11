const addTask = document.getElementById("addTaskButton");
const buttonAddTaskHeader = document.getElementById("button-add-tusk");
const closeModalTaskButton = document.getElementById("closeModalAddTask");
const modalOverlay = document.getElementById("modalOverlay");
const cancelButtonModal = document.getElementById("cancelButtonModal");

function openModalAddTask() {
  modalOverlay.classList.add("active");
  // фокус на первое поле для быстрого старта
  const firstInput = modalOverlay.querySelector("input, textarea");
  if (firstInput) setTimeout(() => firstInput.focus(), 250);
}

function closeModalAddTask() {
  modalOverlay.classList.remove("active");
}

if (addTask) {
  addTask.addEventListener("click", openModalAddTask);
}
if (buttonAddTaskHeader) {
  buttonAddTaskHeader.addEventListener("click", openModalAddTask);
}

closeModalTaskButton.addEventListener("click", closeModalAddTask);

cancelButtonModal.addEventListener("click", closeModalAddTask);

// закрытие по клику на затемнённый фон
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModalAddTask();
});

// закрытие по Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
    closeModalAddTask();
  }
});

/* ===== Кнопка «Добавить колонку» -> инпут ===== */
const addColumnButton = document.getElementById("addColumnButton");
const addColumnInput = document.getElementById("addColumnInput");

function showAddColumnInput() {
  addColumnButton.hidden = true;
  addColumnInput.hidden = false;
  addColumnInput.focus();
}

function hideAddColumnInput() {
  addColumnInput.value = "";
  addColumnInput.hidden = true;
  addColumnButton.hidden = false;
}

function createColumn(title) {
  const column = document.createElement("article");
  column.className = "column";
  column.innerHTML = `
    <header class="column-header">
      <div class="column-title-block">
        <span class="column-color-dot"></span>
        <h4 class="column-title"></h4>
        <span class="column-count">0</span>
      </div>
    </header>
    <div class="task-list"></div>
    <footer class="column-footer">
      <button type="button" class="column-add-card">+ Добавить карточку</button>
    </footer>`;
  column.querySelector(".column-title").textContent = title;
  document.querySelector(".columns-zone").insertBefore(column, addColumnButton);
}

if (addColumnButton && addColumnInput) {
  // клик по кнопке — превращаем её в инпут
  addColumnButton.addEventListener("click", showAddColumnInput);

  // Enter — создать колонку, Escape — отменить
  addColumnInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const title = addColumnInput.value.trim();
      if (title) createColumn(title);
      hideAddColumnInput();
    } else if (e.key === "Escape") {
      hideAddColumnInput();
    }
  });

  // потеря фокуса (клик вне) — тоже возвращаем кнопку
  addColumnInput.addEventListener("blur", () => {
    if (addColumnInput.value.trim()) {
      createColumn(addColumnInput.value.trim());
    }
    hideAddColumnInput();
  });
}

/* ===== Кастомный select выбора исполнителя ===== */
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
    `option[value="${CSS.escape(value)}"]`
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

  // подсветка выбранного пункта в списке
  userSelect.querySelectorAll(".user-select-option").forEach((li) => {
    li.classList.toggle("selected", li.dataset.value === value);
  });
}

// Синхронизация нативного select с опциями кастомного списка
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

  // закрытие по клику вне блока
  document.addEventListener("click", (e) => {
    if (!userSelect.contains(e.target)) closeUserSelect();
  });

  // закрытие по Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeUserSelect();
  });

  // инициализация текущим значением нативного select
  updateUserSelectValue(nativeAssigneeSelect.value);
}
