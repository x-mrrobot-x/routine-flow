const CategoryRenderer = (() => {
  const ALL_CATEGORY = {
    id: "all",
    name: "category_all",
    color: "#9CA3AF"
  };

  const elements = {
    btns: DOM.$("#category-buttons"),
    addBtn: DOM.$("#add-category-btn")
  };

  let selectedId = "all";

  function getCount(categoryId) {
    const routines = RoutineService.getAll();
    return categoryId === "all"
      ? routines.length
      : routines.filter(r => r.categoryId === categoryId).length;
  }

  function createBtn(category) {
    const btn = document.createElement("button");
    const count = getCount(category.id);
    const isActive = selectedId === category.id;

    btn.className = `category-button card ${isActive ? "active" : ""}`;
    btn.style = `--category-color: ${category.color}`;
    btn.dataset.id = category.id;
    btn.innerHTML = `
      <span class="category-name">${I18n.get(category.name)}</span>
      <div class="category-count badge">${count}</div>`;

    return btn;
  }

  function updateActive(categoryId) {
    const btns = DOM.$$(".category-button", elements.btns);
    btns.forEach(btn => {
      const isSelected = btn.dataset.id === categoryId;
      btn.classList.toggle("active", isSelected);
    });
  }

  function handleClick(e) {
    const btn = e.target.closest(".category-button");
    if (!btn) return;

    selectedId = btn.dataset.id;
    updateActive(selectedId);
    RoutineFilter.setState("currentCategoryFilter", selectedId);
  }

  function handleCreate() {
    CategoryModal.open();
  }

  function getSelected() {
    return selectedId;
  }

  const handlers = {
    click: handleClick,
    create: handleCreate
  };

  function bindEvents() {
    const bindings = [
      [elements.btns, "click", handlers.click],
      [elements.addBtn, "click", handlers.create]
    ];
    bindings.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );

    const eventNames = [
      "data:category:changed",
      "routine:deleted",
      "routine:updated",
      "routine:added"
    ];
    eventNames.forEach(event => EventBus.on(event, render));
  }

  function render() {
    const categories = CategoryService.getAll();
    categories.unshift(ALL_CATEGORY);
    const buttons = categories.map(createBtn);

    elements.btns.innerHTML = "";
    elements.btns.append(...buttons);
  }

  function init() {
    render();
    bindEvents();
  }

  return {
    init,
    getSelected,
    updateActive
  };
})();
