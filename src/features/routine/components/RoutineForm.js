const RoutineFormUtils = (() => {
  const ERROR_IDS = [
    "title-error",
    "description-error",
    "command-error",
    "priority-error",
    "time-error",
    "frequency-error"
  ];
  const REQUIRED_FIELDS = {
    title: "form_error_title_required",
    description: "form_error_description_required",
    time: "form_error_time_required"
  };

  function getValue(el) {
    return el.value.trim();
  }

  function getFormData(elements) {
    return {
      title: getValue(elements.titleInput),
      description: getValue(elements.descriptionInput),
      commands: RoutineModal.getState("commands"),
      categoryId: getValue(elements.categorySelect),
      priority: getValue(elements.prioritySelect),
      time: Utils.timeToSeconds(getValue(elements.timeInput)),
      selectedDays: RoutineModal.getState("selectedDays"),
      specificDate: RoutineModal.getState("specificDate"),
      frequencyType: RoutineModal.getState("frequencyType")
    };
  }

  function showError(id, message) {
    const el = document.getElementById(id);
    if (el) el.textContent = message;
  }

  function validateField(field, value, errors) {
    if (!value) {
      showError(`${field}-error`, I18n.get(REQUIRED_FIELDS[field]));
      errors.push(field);
    }
  }

  function validateFrequency(data, errors) {
    const { frequencyType, selectedDays, specificDate } = data;

    if (frequencyType === "days" && selectedDays.length === 0) {
      showError("frequency-error", I18n.get("form_error_days_required"));
      errors.push("days");
    } else if (frequencyType === "specific" && !specificDate) {
      showError("frequency-error", I18n.get("form_error_date_required"));
      errors.push("date");
    }
  }

  function validateForm(data) {
    const errors = [];

    validateField("title", data.title, errors);
    validateField("description", data.description, errors);
    validateField("time", data.time, errors);
    validateFrequency(data, errors);

    return errors.length === 0;
  }

  function createData(data) {
    const frequency =
      data.frequencyType === "days"
        ? [...data.selectedDays.sort()]
        : data.specificDate;

    return {
      title: data.title,
      description: data.description,
      commands: data.commands,
      priority: data.priority,
      time: data.time,
      frequency,
      categoryId: data.categoryId
    };
  }

  function populateFields(routine, elements) {
    const mappings = [
      [elements.titleInput, routine.title],
      [elements.descriptionInput, routine.description],
      [elements.categorySelect, routine.categoryId],
      [elements.prioritySelect, routine.priority],
      [elements.timeInput, Utils.secondsToTime(routine.time)]
    ];

    mappings.forEach(([field, value]) => (field.value = value));
  }

  function updateDays(frequency, btns) {
    btns.forEach(btn => {
      const day = parseInt(btn.dataset.day);
      btn.classList.toggle("selected", frequency.includes(day));
    });
  }

  function updateFrequencyDisplay(type, elements) {
    const isDaily = type === "days";

    elements.weekdaysContainer.style.display = isDaily ? "flex" : "none";
    elements.specificDateContainer.style.display = isDaily ? "none" : "block";

    elements.frequencyBtns.forEach(btn =>
      btn.classList.toggle("active", type === btn.dataset.type)
    );
  }

  function clearErrors() {
    const errorIds = ERROR_IDS;
    errorIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = "";
    });
  }

  function resetDays(btns) {
    btns.forEach(btn => btn.classList.remove("selected"));
  }

  function focusTitle(input) {
    requestAnimationFrame(() => input.focus());
  }

  return {
    getFormData,
    validateForm,
    createData,
    populateFields,
    updateDays,
    updateFrequencyDisplay,
    clearErrors,
    resetDays,
    focusTitle
  };
})();

const RoutineForm = (() => {
  const elements = {
    form: DOM.$("#routine-form"),
    titleInput: DOM.$("#title"),
    descriptionInput: DOM.$("#description"),
    commandInput: DOM.$("#command"),
    prioritySelect: DOM.$("#priority"),
    timeInput: DOM.$("#time"),
    frequencyButtons: DOM.$("#frequency-buttons"),
    frequencyBtns: DOM.$$("#frequency-buttons button"),
    weekdaysContainer: DOM.$("#weekdays-container"),
    dayBtns: DOM.$$(".day-btn"),
    specificDateContainer: DOM.$("#specific-date-container"),
    specificDateInput: DOM.$("#specific-date-input"),
    categorySelect: DOM.$("#category-select")
  };

  function handleEdit(data) {
    const id = RoutineModal.getState("routineToEdit");
    const original = RoutineService.getById(id);
    const { categoryId: oldCategoryId } = original;
    const { categoryId: newCategoryId } = data;

    RoutineService.update(id, { ...data, active: true });

    const currentFilter = RoutineFilter.getState("currentCategoryFilter");
    if (currentFilter !== "all" && newCategoryId !== oldCategoryId) {
      EventBus.emit("routine:deleted", [id]);
    }

    Toast.show("success", "toast_routine_updated");
  }

  function handleCreate(data) {
    const routine = {
      id: Date.now().toString(),
      ...data,
      active: true
    };

    RoutineService.add(routine);
    Toast.show("success", "toast_routine_created");
  }

  function setupEdit(routine) {
    RoutineFormUtils.populateFields(routine, elements);
    updateCommandDisplay();

    const frequencyType = RoutineModal.getState("frequencyType");
    RoutineFormUtils.updateFrequencyDisplay(frequencyType, elements);

    if (frequencyType === "days") {
      RoutineFormUtils.updateDays(routine.frequency, elements.dayBtns);
    } else {
      elements.specificDateInput.value = routine.frequency;
    }

    RoutineFormUtils.clearErrors();
    RoutineFormUtils.focusTitle(elements.titleInput);
  }

  function updateCommandDisplay() {
    const currentCommands = RoutineModal.getState("commands");
    elements.commandInput.value =
      currentCommands.length === 0
        ? ""
        : `${currentCommands.length} ${I18n.get("form_selected_commands")}`;
  }

  function updateDays(day, selected) {
    const days = RoutineModal.getState("selectedDays");
    const newDays = selected ? [...days, day] : days.filter(d => d !== day);
    RoutineModal.setState("selectedDays", newDays);
  }

  function setupCreate() {
    elements.form.reset();
    RoutineFormUtils.clearErrors();
    RoutineFormUtils.resetDays(elements.dayBtns);
    updateCommandDisplay();
    
    RoutineModal.setState("frequencyType", "days");
    RoutineFormUtils.updateFrequencyDisplay("days", elements);
    elements.specificDateInput.value = "";

    const selected = RoutineFilter.getState("currentCategoryFilter");
    if (selected !== "all") elements.categorySelect.value = selected;

    RoutineFormUtils.focusTitle(elements.titleInput);
  }

  function handleSubmit(e) {
    e.preventDefault();
    RoutineFormUtils.clearErrors();

    const formData = RoutineFormUtils.getFormData(elements);
    if (!RoutineFormUtils.validateForm(formData)) return;

    const data = RoutineFormUtils.createData(formData);
    const isEdit = RoutineModal.getState("isEditMode");

    isEdit ? handleEdit(data) : handleCreate(data);
    RoutineModal.close();
  }

  function toggleDay(e) {
    const day = parseInt(e.target.dataset.day);
    if (isNaN(day)) return;

    e.target.classList.toggle("selected");
    updateDays(day, e.target.classList.contains("selected"));
  }

  function setFrequencyType(e) {
    const { type } = e.target.dataset;
    if (!type) return;

    RoutineModal.setState("frequencyType", type);
    RoutineFormUtils.updateFrequencyDisplay(type, elements);
  }

  function handleDateInput(e) {
    RoutineModal.setState("specificDate", e.target.value);
  }

  function handleCommandClick() {
    CommandPickerModal.open();
  }

  function populateCategorySelect() {
    const categories = CategoryService.getAll();
    elements.categorySelect.innerHTML = "";

    categories.forEach(category => {
      if (category.isVirtual) return;

      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = I18n.get(category.name);
      elements.categorySelect.appendChild(option);
    });
  }

  const handlers = {
    submit: handleSubmit,
    commandClick: handleCommandClick,
    frequency: setFrequencyType,
    toggleDay: toggleDay,
    dateInput: handleDateInput
  };

  function bindEvents() {
    const bindings = [
      [elements.form, "submit", handlers.submit],
      [elements.commandInput, "click", handlers.commandClick],
      [elements.frequencyButtons, "click", handlers.frequency],
      [elements.weekdaysContainer, "click", handlers.toggleDay],
      [elements.specificDateInput, "input", handlers.dateInput]
    ];

    bindings.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );

    EventBus.on("data:category:changed", populateCategorySelect);
  }

  function render() {
    populateCategorySelect();
  }

  function init() {
    CommandDropdown.init();
    render();
    bindEvents();
  }

  return {
    init,
    setupEdit,
    setupCreate,
    updateCommandDisplay
  };
})();
