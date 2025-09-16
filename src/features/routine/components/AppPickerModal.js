const AppPickerModal = (() => {
  const PAGE_SIZE = 15;
  const THRESHOLD_PX = 200;

  let paginationManager = null;
  let selectedCommand = "/open";

  const elements = {
    modal: DOM.$("#app-picker-modal"),
    overlay: DOM.$("#app-picker-modal .modal-overlay"),
    closeBtn: DOM.$("#apps-modal-close"),
    grid: DOM.$("#apps-grid")
  };

  function createCard({ name, pkg }) {
    const iconSrc =
      ENV.name === "web"
        ? `${ENV.iconPath}${pkg}.png`
        : `${ENV.iconPath}${pkg}`;

    return `<div class="app-card" data-app="${name}">
      <img src="${iconSrc}" class="app-icon" />
      <p class="app-name">${name}</p>
    </div>`;
  }

  function createItems(apps) {
    return apps.map(createCard).join("");
  }

  function appendApps(apps) {
    elements.grid.insertAdjacentHTML("beforeend", createItems(apps));
  }

  function handleAppSelect(e) {
    const card = e.target.closest(".app-card");
    if (!card) return;

    CommandPickerModal.setCommandInput(`${selectedCommand} ${card.dataset.app}`);
    close();
  }

  function open(command) {
    selectedCommand = command || "/open";
    Modal.show(elements.modal);
  }

  function close() {
    Modal.hide(elements.modal);
  }

  const handlers = {
    appSelect: handleAppSelect,
    close: close,
    overlay: close
  };

  function bindEvents() {
    const bindings = [
      [elements.closeBtn, "click", handlers.close],
      [elements.overlay, "click", handlers.overlay],
      [elements.grid, "click", handlers.appSelect]
    ];

    bindings.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function render(data) {
    const apps = data || ENV.loadApps();
    elements.grid.innerHTML = "";

    paginationManager.load(apps);
  }

  function createPagination() {
    paginationManager = PaginationManager.create({
      scrollElement: elements.grid,
      pageSize: PAGE_SIZE,
      thresholdPx: THRESHOLD_PX,
      renderAppend: appendApps
    });
  }

  function init() {
    createPagination();
    render();
    bindEvents();
  }

  return {
    init,
    open,
    close,
    render
  };
})();
