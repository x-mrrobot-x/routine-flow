const RoutineModalUtils = (() => {
  function setCreateState() {
    RoutineModal.setState({
      selectedDays: [],
      commands: [],
      specificDate: null,
      frequencyType: "days",
      isEditMode: false,
      routineToEdit: null
    });
  }

  function setEditState(routine) {
    const isSpecific = typeof routine.frequency === "string";

    RoutineModal.setState({
      selectedDays: isSpecific ? [] : [...routine.frequency],
      commands: [...routine.commands],
      specificDate: isSpecific ? routine.frequency : null,
      frequencyType: isSpecific ? "specific" : "days",
      isEditMode: true,
      routineToEdit: routine.id
    });
  }

  function updateTexts(title, desc, btnContent, elements) {
    elements.title.textContent = title;
    elements.description.textContent = desc;
    elements.submitBtn.innerHTML = btnContent;
  }

  return {
    setCreateState,
    setEditState,
    updateTexts
  };
})();

const RoutineModal = (() => {
  const CONTENT_KEYS = {
    create: {
      title: "create_routine_title",
      subtitle: "create_routine_subtitle",
      button: "create_button",
      icon: "calendar-plus"
    },
    edit: {
      title: "edit_routine_title",
      subtitle: "edit_routine_subtitle",
      button: "update_button",
      icon: "calendar-sync"
    }
  };

  const elements = {
    modal: DOM.$("#routine-modal"),
    overlay: DOM.$("#routine-modal .modal-overlay"),
    title: DOM.$("#routine-modal .modal-title"),
    description: DOM.$("#routine-modal .modal-description"),
    cancelBtn: DOM.$("#cancel-routine"),
    submitBtn: DOM.$("#create-routine-btn")
  };

  let state = {
    selectedDays: [],
    commands: [],
    specificDate: null,
    isEditMode: false,
    frequencyType: "days",
    routineToEdit: null
  };

  function getState(key) {
    return state[key];
  }

  function setState(key, value) {
    if (typeof key === "object") {
      state = { ...state, ...key };
      return;
    }
    state[key] = value;
  }

  function getContent(isEdit) {
    const config = CONTENT_KEYS[isEdit ? "edit" : "create"];

    return {
      title: I18n.get(config.title),
      subtitle: I18n.get(config.subtitle),
      submitButton: `${Icons.getIcon(config.icon)} ${I18n.get(config.button)}`
    };
  }

  function setupEdit(routine) {
    RoutineModalUtils.setEditState(routine);
    const { title, subtitle, submitButton } = getContent(true);
    RoutineModalUtils.updateTexts(title, subtitle, submitButton, elements);
    RoutineForm.setupEdit(routine);
  }

  function setupCreate() {
    RoutineModalUtils.setCreateState();
    const { title, subtitle, submitButton } = getContent(false);
    RoutineModalUtils.updateTexts(title, subtitle, submitButton, elements);
    RoutineForm.setupCreate();
  }

  function open(routine) {
    routine ? setupEdit(routine) : setupCreate();
    Modal.show(elements.modal);
  }

  function close() {
    Modal.hide(elements.modal);
  }

  const handlers = {
    cancel: close,
    overlay: close
  };

  function bindEvents() {
    const bindings = [
      [elements.cancelBtn, "click", handlers.cancel],
      [elements.overlay, "click", handlers.overlay]
    ];

    bindings.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function init() {
    RoutineForm.init();
    bindEvents();
  }

  return {
    init,
    open,
    close,
    getState,
    setState
  };
})();
