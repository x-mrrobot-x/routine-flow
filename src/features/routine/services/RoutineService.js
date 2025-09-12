const RoutineService = (() => {
  let routines = [];

  function setRoutines(newRoutines, shouldSave = true) {
    routines = newRoutines;
    if (shouldSave) save();
  }

  function getById(id) {
    return routines.find(r => r.id === id) || null;
  }

  function getAll() {
    return Array.isArray(routines)
      ? routines.map(routine => ({ ...routine }))
      : [];
  }

  function add(routine) {
    const newRoutine = { ...routine, id: Date.now() };
    routines.push(newRoutine);
    save();
    EventBus.emit("routine:added", newRoutine);
  }

  function update(id, data) {
    const index = routines.findIndex(r => r.id === id);
    routines[index] = { ...routines[index], ...data };
    save();
    EventBus.emit("routine:updated", id, routines[index]);
  }

  function removeById(id) {
    routines = routines.filter(r => r.id !== id);
    save();
    EventBus.emit("routine:deleted", [id]);
  }

  function removeByCategory(id) {
    const deletedIds = [];

    routines = routines.filter(r => {
      if (r.categoryId === id) {
        deletedIds.push(r.id);
        return false;
      }
      return true;
    });

    save();
    EventBus.emit("routine:deleted", deletedIds);
  }

  function save() {
    const data = JSON.stringify(routines, null, 2);
    ENV.saveRoutines(data);
  }

  function load() {
    const stored = ENV.getRoutines();

    if (!stored) {
      setRoutines(DEFAULT_ROUTINES);
      return;
    }

    const parsedRoutines = JSON.parse(stored);
    setRoutines(parsedRoutines, false);
  }

  function init() {
    load();
  }

  return {
    init,
    save,
    getAll,
    getById,
    add,
    update,
    removeById,
    removeByCategory,
    setRoutines
  };
})();
