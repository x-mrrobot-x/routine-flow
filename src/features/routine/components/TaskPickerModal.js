const TaskPickerModal = (() => {
  const PAGE_SIZE = 10;
  const THRESHOLD_PX = 200;
  let tasks = [];
  let filteredTasks = [];

  let paginationManager = null;
  let selectedCommand = "/run_task";

  const elements = {
    modal: DOM.$("#task-picker-modal"),
    overlay: DOM.$("#task-picker-modal .modal-overlay"),
    closeBtn: DOM.$("#tasks-modal-close"),
    grid: DOM.$("#tasks-grid"),
    searchInput: DOM.$("#task-search-input"),
    count: DOM.$("#tasks-count")
  };

  function updateCount() {
    elements.count.textContent = filteredTasks.length;
  }

  function createCard({ name }) {
    return `<div class="task-card" data-task="${name}">
            <p class="task-name">${name}</p>
        </div>`;
  }

  function createItems(tasks) {
    return tasks.map(task => createCard({ name: task })).join("");
  }

  function appendTasks(tasks) {
    elements.grid.insertAdjacentHTML("beforeend", createItems(tasks));
  }

  function handleTaskSelect(e) {
    const card = e.target.closest(".task-card");
    if (!card) return;

    CommandPickerModal.setCommandInput(`${selectedCommand} ${card.dataset.task}`);
    close();
  }

  function open(command) {
    selectedCommand = command || "/run_task";
    Modal.show(elements.modal);
  }

  function close() {
    Modal.hide(elements.modal);
  }

  function filterTasks() {
    const searchTerm = elements.searchInput.value.toLowerCase();

    if (searchTerm === "") {
      filteredTasks = [...tasks];
    } else {
      filteredTasks = tasks.filter(task =>
        task.toLowerCase().includes(searchTerm)
      );
    }

    updateCount();
    render();
  }

  function updateAll() {
    updateCount();
    render();
  }

  const handlers = {
    taskSelect: handleTaskSelect,
    close: close,
    overlay: close,
    filter: filterTasks
  };

  function bindEvents() {
    const bindings = [
      [elements.closeBtn, "click", handlers.close],
      [elements.overlay, "click", handlers.overlay],
      [elements.grid, "click", handlers.taskSelect],
      [elements.searchInput, "input", handlers.filter]
    ];

    bindings.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function load(data) {
    tasks = data || ENV.loadTasks();
    filteredTasks = [...tasks];
  }

  function render() {
    const tasksToRender = filteredTasks;
    elements.grid.innerHTML = "";
    paginationManager.load(tasksToRender);
  }

  function createPagination() {
    paginationManager = PaginationManager.create({
      scrollElement: elements.grid,
      pageSize: PAGE_SIZE,
      thresholdPx: THRESHOLD_PX,
      renderAppend: appendTasks
    });
  }

  function init() {
    load();
    createPagination();
    updateAll();
    bindEvents();
  }

  return {
    init,
    open,
    load,
    updateAll
  };
})();
