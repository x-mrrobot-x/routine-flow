const RoutineFilterUtils = (() => {
  const FILTER_CONFIG = {
    search: {
      stateKey: "currentSearchFilter",
      processor: value => value.toLowerCase().trim()
    },
    status: {
      stateKey: "currentStatusFilter",
      processor: value => value
    },
    priority: {
      stateKey: "currentPriorityFilter",
      processor: value => value
    },
    day: {
      stateKey: "currentDayFilter",
      processor: value => value
    },
    command: {
      stateKey: "currentCommandFilter",
      processor: value => value
    }
  };

  const DEFAULT_VALUES = {
    statusFilter: "all",
    priorityFilter: "all",
    dayFilter: "all",
    searchFilter: "",
    commandFilter: "all"
  };

  const STATUS_MAP = {
    active: r => r.active,
    inactive: r => !r.active,
    pending: r => r.status === "pending"
  };

  const FILTER_STRATEGIES = {
    status: (routine, value) => {
      if (value === "all") return true;
      const handler = STATUS_MAP[value];
      return handler ? handler(routine) : false;
    },
    priority: (routine, value) => value === "all" || routine.priority === value,
    day: (routine, value) => {
      if (value === "all") return true;

      if (typeof routine.frequency === "string") {
        return false;
      }

      if (Array.isArray(routine.frequency)) {
        return routine.frequency.includes(parseInt(value));
      }

      return false;
    },
    search: (routine, term) => {
      if (!term) return true;
      const text = `${routine.title.toLowerCase()} ${routine.description.toLowerCase()}`;
      return text.includes(term);
    },
    command: (routine, value) =>
      value === "all" || routine.command.startsWith(value),
    category: (routine, value) =>
      value === "all" || routine.categoryId === value
  };

  function resetStates() {
    RoutineFilter.setState({
      currentStatusFilter: "all",
      currentPriorityFilter: "all",
      currentDayFilter: "all",
      currentSearchFilter: "",
      currentCommandFilter: "all"
    });
  }

  function processValue(type, value) {
    const config = FILTER_CONFIG[type];
    return config ? config.processor(value) : value;
  }

  function updateState(key, value) {
    RoutineFilter.setState(key, value);
  }

  function handleChange(type, value) {
    const config = FILTER_CONFIG[type];
    if (!config) return;

    const processed = processValue(type, value);
    updateState(config.stateKey, processed);
  }

  function createHandler(type) {
    return e => handleChange(type, e.target.value);
  }

  function toggleAdvanced(bar) {
    const show = !RoutineFilter.getState("showAdvancedFilters");
    RoutineFilter.setState("showAdvancedFilters", show);
    bar.classList.toggle("extended", show);
  }

  function isOutside(target, bar) {
    return !bar.contains(target);
  }

  function resetDOM(elements) {
    const entries = Object.entries(DEFAULT_VALUES);
    entries.forEach(([key, value]) => {
      elements[key].value = value;
    });
  }

  function sortByTime(routines) {
    return [...routines].sort((a, b) => a.time - b.time);
  }

  function getValues(state) {
    return {
      status: state.currentStatusFilter,
      priority: state.currentPriorityFilter,
      day: state.currentDayFilter,
      search: state.currentSearchFilter,
      command: state.currentCommandFilter,
      category: state.currentCategoryFilter
    };
  }

  function applyFilters(routines, values) {
    return routines.filter(routine =>
      Object.entries(FILTER_STRATEGIES).every(([type, strategy]) =>
        strategy(routine, values[type])
      )
    );
  }

  function createOption(command) {
    const element = document.createElement("option");
    element.value = command;
    element.textContent = command;
    return element;
  }

  function getBaseCommands(routines) {
    return routines.reduce((acc, routine) => {
      const baseCommand = routine.command.split(" ")[0];
      if (!acc.includes(baseCommand)) {
        acc.push(baseCommand);
      }
      return acc;
    }, []);
  }

  function populateCommandFilter(elements) {
    const routines = RoutineService.getAll();
    const commands = getBaseCommands(routines);

    commands.forEach(command => {
      const option = createOption(command);
      elements.commandFilter.appendChild(option);
    });
  }

  return {
    resetStates,
    createHandler,
    toggleAdvanced,
    isOutside,
    resetDOM,
    sortByTime,
    getValues,
    applyFilters,
    populateCommandFilter
  };
})();

const RoutineFilter = (() => {
  const elements = {
    filtersBar: DOM.$("#filters-bar"),
    toggleBtn: DOM.$("#toggle-filters-btn"),
    searchFilter: DOM.$("#search-filter"),
    statusFilter: DOM.$("#status-filter"),
    priorityFilter: DOM.$("#priority-filter"),
    dayFilter: DOM.$("#day-filter"),
    commandFilter: DOM.$("#command-filter")
  };

  let state = {
    showAdvancedFilters: false,
    currentStatusFilter: "all",
    currentPriorityFilter: "all",
    currentDayFilter: "all",
    currentSearchFilter: "",
    currentCommandFilter: "all",
    currentCategoryFilter: "all"
  };

  function getState(key) {
    return key ? state[key] : state;
  }

  function setState(key, value) {
    if (typeof key === "object") {
      state = { ...state, ...key };
    } else {
      state[key] = value;
    }

    if (key !== "showAdvancedFilters") {
      EventBus.emit("filter:changed");
    }
  }

  function handleToggle() {
    RoutineFilterUtils.toggleAdvanced(elements.filtersBar);
  }

  function handleOutside(e) {
    const open = getState("showAdvancedFilters");
    if (RoutineFilterUtils.isOutside(e.target, elements.filtersBar) && open) {
      handleToggle();
    }
  }

  function resetFilters() {
    RoutineFilterUtils.resetDOM(elements);
    RoutineFilterUtils.resetStates();
  }

  function filterRoutines(routines) {
    const state = getState();
    const values = RoutineFilterUtils.getValues(state);
    const filtered = RoutineFilterUtils.applyFilters(routines, values);
    return RoutineFilterUtils.sortByTime(filtered);
  }

  function isAnyActive() {
    const state = getState();
    const values = RoutineFilterUtils.getValues(state);

    return (
      values.status !== "all" ||
      values.priority !== "all" ||
      values.day !== "all" ||
      values.search !== ""
    );
  }

  const handlers = {
    search: RoutineFilterUtils.createHandler("search"),
    status: RoutineFilterUtils.createHandler("status"),
    priority: RoutineFilterUtils.createHandler("priority"),
    command: RoutineFilterUtils.createHandler("command"),
    day: RoutineFilterUtils.createHandler("day"),
    toggle: handleToggle,
    outside: handleOutside,
    reset: resetFilters
  };

  function bindEvents() {
    const events = [
      [elements.toggleBtn, "click", handlers.toggle],
      [elements.statusFilter, "change", handlers.status],
      [elements.priorityFilter, "change", handlers.priority],
      [elements.dayFilter, "change", handlers.day],
      [elements.searchFilter, "input", handlers.search],
      [elements.commandFilter, "change", handlers.command],
      [document, "click", handlers.outside]
    ];

    events.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function init() {
    RoutineFilterUtils.populateCommandFilter(elements);
    bindEvents();
  }

  return {
    init,
    resetFilters,
    filterRoutines,
    isAnyActive,
    getState,
    setState
  };
})();
