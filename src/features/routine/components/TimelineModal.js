const TimelineModal = (() => {
  const elements = {
    modal: DOM.$("#timeline-modal"),
    closeBtn: DOM.$("#timeline-modal-close"),
    container: DOM.$("#timeline-container"),
    overlay: DOM.$("#timeline-modal .modal-overlay")
  };

  function open() {
    render();
    Modal.show(elements.modal);
  }

  function close() {
    Modal.hide(elements.modal);
  }

  function getTodayRoutines(routines) {
    const now = new Date();
    const currentDay = now.getDay();
    const todayDate = now.toISOString().split("T")[0];

    return routines.filter(routine => {
      if (!routine.active) return false;

      if (Array.isArray(routine.frequency)) {
        return routine.frequency.includes(currentDay);
      }

      return routine.frequency === todayDate;
    });
  }

  function getCurrentTime() {
    const now = new Date();
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  }

  function getStatusClass(routineTime, currentTime, isNext = false) {
    if (routineTime < currentTime) return "past";
    if (isNext) return "current";
    return "upcoming";
  }

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  function createEmptyHTML() {
    return `
      <div class="empty-timeline">
        ${Icons.getIcon("calendar")}
        <p>${I18n.get("timeline_empty_text")}</p>
      </div>
    `;
  }

  function createTimelineHTML(routines, currentTime) {
    const nextIndex = routines.findIndex(routine => routine.time > currentTime);

    const items = routines
      .map((routine, index) => {
        const isNext = index === nextIndex;
        const statusClass = getStatusClass(routine.time, currentTime, isNext);
        const time = formatTime(routine.time);
        const priority = RoutineRenderer.getPriorityConfig(routine.priority);

        return `
        <div class="timeline-item ${statusClass}">
          <div class="timeline-time">${time}</div>
          <div class="timeline-point"></div>
          <div class="timeline-card">
            <h3 class="timeline-card-title">${routine.title}</h3>
            <span class="priority-badge ${priority.className}">${priority.icon}</span>
          </div>
        </div>
      `;
      })
      .join("");

    return `<div class="timeline">${items}</div>`;
  }

  function render() {
    const routines = RoutineService.getAll();
    const todayRoutines = getTodayRoutines(routines);

    if (todayRoutines.length === 0) {
      elements.container.innerHTML = createEmptyHTML();
      return;
    }

    const sorted = [...todayRoutines].sort((a, b) => a.time - b.time);
    const currentTime = getCurrentTime();
    elements.container.innerHTML = createTimelineHTML(sorted, currentTime);
  }

  const handlers = {
    close: close
  };

  function bindEvents() {
    const bindings = [
      [elements.closeBtn, "click", handlers.close],
      [elements.overlay, "click", handlers.close]
    ];

    bindings.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function init() {
    bindEvents();
  }

  return {
    init,
    open,
    close
  };
})();
