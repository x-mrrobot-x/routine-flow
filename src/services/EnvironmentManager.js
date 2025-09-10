const EnvironmentManager = (() => {
  const WebEnvironment = (() => {
    const NAME = "web";
    const WORK_DIR = ".";
    const LANG_CODE = "pt-BR";
    const ICON_PATH = "src/assets/icons/";

    const STORAGE_KEYS = {
      routines: "@routine-flow:routines",
      settings: "@routine-flow:settings",
      categories: "@routine-flow:categories"
    };

    async function loadLang(code) {
      const response = await fetch(`${WORK_DIR}/src/locales/${code}.json`);
      return await response.json();
    }

    function loadApps() {
      return DEFAULT_APPS;
    }

    function loadTasks() {
      return DEFAULT_TASKS;
    }

    function getCategories() {
      return localStorage.getItem(STORAGE_KEYS.categories);
    }

    function saveCategories(data) {
      localStorage.setItem(STORAGE_KEYS.categories, data);
    }

    function getRoutines() {
      return localStorage.getItem(STORAGE_KEYS.routines);
    }

    function saveRoutines(data) {
      localStorage.setItem(STORAGE_KEYS.routines, data);
    }

    function getSettings() {
      return localStorage.getItem(STORAGE_KEYS.settings);
    }

    function saveSettings(settings) {
      localStorage.setItem(STORAGE_KEYS.settings, settings);
    }

    function exit() {
      alert("Fechando aplicação...");
    }

    return {
      name: NAME,
      langCode: LANG_CODE,
      workDir: WORK_DIR,
      iconPath: ICON_PATH,
      loadLang,
      loadApps,
      loadTasks,
      getCategories,
      saveCategories,
      getRoutines,
      saveRoutines,
      getSettings,
      saveSettings,
      exit
    };
  })();

  function detect() {
    return typeof tk === "undefined" ? WebEnvironment : TaskerEnvironment;
  }

  return {
    detect
  };
})();

const ENV = EnvironmentManager.detect();
