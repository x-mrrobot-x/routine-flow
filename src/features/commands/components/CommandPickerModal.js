const CommandPickerModal = (() => {
  const elements = {
    modal: DOM.$("#commands-modal"),
    overlay: DOM.$("#commands-modal .modal-overlay"),
    closeBtn: DOM.$("#commands-modal-close"),
    cancelBtn: DOM.$("#cancel-commands"),
    saveBtn: DOM.$("#save-commands"),
    list: DOM.$("#commands-list"),
    input: DOM.$("#new-command-input"),
    addBtn: DOM.$("#add-command-btn")
  };

  function open() {
    render();
    elements.input.value = "";
    Modal.show(elements.modal);
    elements.input.focus();
  }

  function close() {
    Modal.hide(elements.modal);
  }

  function setCommandInput(command) {
    elements.input.value = command;
    elements.input.focus();
  }

  function render() {
    const currentCommands = RoutineModal.getState("commands");
    if (!currentCommands.length) {
      elements.list.innerHTML = `
        <div class="empty-commands">
          ${I18n.get("no_commands_assigned")}
        </div>
      `;
      return;
    }

    const commandItems = currentCommands.map(
      (command, index) => `
      <div class="command-item" data-index="${index}">
        <div class="command-text">${command}</div>
        <button class="button delete-btn" data-index="${index}">
          ${Icons.getIcon("trash2")}
        </button>
      </div>
    `
    );

    elements.list.innerHTML = commandItems.join("");
  }

  function validateCommand(command) {
    if (!command.startsWith("/")) {
      Toast.show("error", I18n.get("form_error_command_invalid"));
      return false;
    }
    return true;
  }

  function addCommand() {
    const command = elements.input.value.trim();
    if (!command) return;

    if (!validateCommand(command)) return;

    const currentCommands = RoutineModal.getState("commands");
    RoutineModal.setState("commands", [...currentCommands, command]);
    elements.input.value = "";
    render();
  }

  function removeCommand(index) {
    const currentCommands = RoutineModal.getState("commands");
    currentCommands.splice(index, 1);
    render();
  }

  function handleInput(event) {
    const { value } = event.target;
    const visible = CommandDropdown.getVisibleDropdown();

    if (value.startsWith("/")) {
      const suggestions = CommandUtils.filterSuggestions(value);
      return suggestions.length > 0
        ? CommandDropdown.open(suggestions)
        : CommandDropdown.close();
    }

    if (visible) CommandDropdown.close();
  }

  function saveCommands() {
    RoutineForm.updateCommandDisplay();
    close();
  }

  function handleRemove(e) {
    const btn = e.target.closest(".delete-btn");
    if (!btn) return;

    const index = parseInt(btn.dataset.index);
    removeCommand(index);
  }

  function handleKeydown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addCommand();
    }
  }

  const handlers = {
    close: close,
    save: saveCommands,
    add: addCommand,
    remove: handleRemove,
    input: handleInput,
    keydown: handleKeydown
  };

  function bindEvents() {
    const bindings = [
      [elements.closeBtn, "click", handlers.close],
      [elements.overlay, "click", handlers.close],
      [elements.cancelBtn, "click", handlers.close],
      [elements.saveBtn, "click", handlers.save],
      [elements.addBtn, "click", handlers.add],
      [elements.list, "click", handlers.remove],
      [elements.input, "input", handlers.input],
      [elements.input, "keydown", handlers.keydown]
    ];

    bindings.forEach(([el, event, handler]) => {
      el.addEventListener(event, handler);
    });
  }

  function init() {
    CommandDropdown.init();
    bindEvents();
  }

  return {
    init,
    open,
    close,
    setCommandInput
  };
})();
