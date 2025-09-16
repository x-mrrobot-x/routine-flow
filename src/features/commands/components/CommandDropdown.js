const CommandUtils = (() => {
  const SUGGESTIONS = [
    {
      cmd: "/open [app]",
      desc: "command_open_description",
      icon: "rocket"
    },
    {
      cmd: "/close [app]",
      desc: "command_close_description",
      icon: "circle-stop"
    },
    {
      cmd: "/wifi [on/off]",
      desc: "command_wifi_description",
      icon: "wifi"
    },
    {
      cmd: "/mobile_data [on/off]",
      desc: "command_mobile_description",
      icon: "signal"
    },
    {
      cmd: "/bluetooth [on/off]",
      desc: "command_bluetooth_description",
      icon: "bluetooth"
    },
    {
      cmd: "/airplane [on/off]",
      desc: "command_airplane_description",
      icon: "plane"
    },
    {
      cmd: "/lockscreen",
      desc: "command_lockscreen_description",
      icon: "lock-screen"
    },
    { cmd: "/run_task [task]", desc: "command_task_description", icon: "play" }
  ];

  function createSuggestionCommand(command) {
    return command.replace(
      /\[([^\]]+)\]/g,
      '<span class="suggestion-command-value">[$1]</span>'
    );
  }

  function createCard({ cmd, desc, icon }) {
    const description = I18n.get(desc);

    return `<div class="suggestion-item" data-command="${cmd}">
        ${Icons.getIcon(icon)}
        <div class="suggestion-content">
          <div class="suggestion-command">
           ${createSuggestionCommand(cmd)}
          </div>
          <div class="suggestion-description">${description}</div>
        </div>
      </div>`;
  }

  function createItems(filteredSuggestions = SUGGESTIONS) {
    return filteredSuggestions.map(createCard).join("");
  }

  function filterSuggestions(input) {
    if (!input) return SUGGESTIONS;

    const searchTerm = input.toLowerCase();
    return SUGGESTIONS.filter(suggestion =>
      suggestion.cmd.toLowerCase().includes(searchTerm.substring(1))
    );
  }

  return {
    createItems,
    filterSuggestions
  };
})();

const CommandDropdown = (() => {
  let visible = false;

  const elements = {
    dropdown: DOM.$("#command-dropdown")
  };

  function getVisibleDropdown() {
    return visible;
  }

  function open(filteredSuggestions) {
    visible = true;
    render(filteredSuggestions);
    Modal.show(elements.dropdown);
  }

  function close() {
    visible = false;
    Modal.hide(elements.dropdown);
  }

  function handleSuggestion(e) {
    const item = e.target.closest(".suggestion-item");
    if (!item) return;

    const { command } = item.dataset;
    const baseCommand = command.split(" ")[0];

    if (baseCommand === "/open" || baseCommand === "/close") {
      AppPickerModal.open(baseCommand);
      close();
      return;
    }

    if (baseCommand === "/run_task") {
      TaskPickerModal.open(baseCommand);
      close();
      return;
    }

    CommandPickerModal.setCommandInput(`${baseCommand} `);
    close();
  }

  function handleOutside(e) {
    if (!elements.dropdown.contains(e.target) && visible) {
      close();
    }
  }

  const handlers = {
    suggestion: handleSuggestion,
    outside: handleOutside
  };

  function bindEvents() {
    const bindings = [
      [elements.dropdown, "click", handlers.suggestion],
      [document, "click", handlers.outside]
    ];

    bindings.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function render(filteredSuggestions) {
    elements.dropdown.innerHTML = CommandUtils.createItems(filteredSuggestions);
  }

  function init() {
    render();
    bindEvents();
  }

  return {
    init,
    open,
    close,
    getVisibleDropdown
  };
})();
