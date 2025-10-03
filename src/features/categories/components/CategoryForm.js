const CategoryFormUtils = (() => {
  function validateName(name, elements) {
    if (!name) {
      Toast.show("error", I18n.get("category_name_required"));
      elements.nameInput.focus();
      return false;
    }
    return true;
  }

  function processCategory(data, state) {
    if (state.isEditing) {
      CategoryService.update(state.editingId, data);
      Toast.show("success", I18n.get("category_updated"));
    } else {
      CategoryService.add(data);
      Toast.show("success", I18n.get("category_added"));
    }
  }

  function selectColor(color, state, elements) {
    state.selectedColor = color;
    elements.colorInput.value = color;

    const items = DOM.$$(".color-item");
    items.forEach(item => {
      item.classList.toggle("selected", item.dataset.color === color);
    });
  }

  return {
    validateName,
    processCategory,
    selectColor
  };
})();

const CategoryForm = (() => {
  const DEFAULT_COLOR = "#c084fc";
  const COLORS = [
    "#c084fc",
    "#a855f7",
    "#9333ea",
    "#7c3aed",
    "#8b5cf6",
    "#4f46e5",
    "#3b82f6",
    "#2563eb",
    "#1d4ed8",
    "#60a5fa",
    "#1e40af",
    "#06b6d4",
    "#0891b2",
    "#0e7490",
    "#0f766e",
    "#14b8a6",
    "#10b981",
    "#059669",
    "#16a34a",
    "#15803d",
    "#65a30d",
    "#eab308",
    "#f59e0b",
    "#d97706",
    "#ea580c",
    "#dc2626",
    "#ef4444",
    "#b91c1c",
    "#e11d48",
    "#ec4899",
    "#be185d",
    "#6b7280",
    "#4b5563",
    "#374151"
  ];

  const elements = {
    form: DOM.$("#category-form"),
    nameInput: DOM.$("#category-name"),
    colorPicker: DOM.$("#color-picker"),
    colorInput: DOM.$("#category-color"),
    saveBtn: DOM.$("#save-category")
  };

  const state = {
    isEditing: false,
    editingId: null,
    selectedColor: DEFAULT_COLOR
  };

  function setupCreate() {
    elements.form.reset();
    state.isEditing = false;
    state.editingId = null;
    CategoryFormUtils.selectColor(DEFAULT_COLOR, state, elements);
    elements.saveBtn.innerHTML = `${Icons.getIcon("plus")} ${I18n.get(
      "add_button"
    )}`;
  }

  function setupEdit(category) {
    elements.nameInput.value = I18n.get(category.name);
    CategoryFormUtils.selectColor(category.color, state, elements);
    state.isEditing = true;
    state.editingId = category.id;
    elements.saveBtn.innerHTML = `${Icons.getIcon("save")} ${I18n.get(
      "save_button"
    )}`;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const name = elements.nameInput.value.trim();
    if (!CategoryFormUtils.validateName(name, elements)) return;

    const data = { name, color: state.selectedColor };
    CategoryFormUtils.processCategory(data, state);
    setupCreate();
  }

  function handleSelectColor(e) {
    const color = e.target.dataset.color;
    if (color) CategoryFormUtils.selectColor(color, state, elements);
  }

  function render() {
    const items = COLORS.map(
      (color, i) =>
        `<div class="color-item ${i === 0 ? "selected" : ""}" 
           style="background: ${color}" 
           data-color="${color}"
           title="${color}">
      </div>`
    );
    elements.colorPicker.innerHTML = items.join("");
  }

  const handlers = {
    submit: handleSubmit,
    selectColor: handleSelectColor
  };

  function bindEvents() {
    const bindings = [
      [elements.form, "submit", handlers.submit],
      [elements.colorPicker, "click", handlers.selectColor]
    ];

    bindings.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function init() {
    render();
    bindEvents();
  }

  return {
    init,
    setupCreate,
    setupEdit
  };
})();
