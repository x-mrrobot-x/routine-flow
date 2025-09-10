const EnvironmentManager = (() => {
  const WebEnvironment = () => {
    const config = {
      name: "web",
      workDir: ".",
      langCode: "pt-BR",
      iconPath: "src/assets/icons/",
      storageKeys: {
        routines: "@routine-flow:routines",
        settings: "@routine-flow:settings",
        categories: "@routine-flow:categories"
      }
    };

    async function loadLang(code) {
      const response = await fetch(
        `${config.workDir}/src/locales/${code}.json`
      );
      return await response.json();
    }

    function loadApps() {
      return DEFAULT_APPS;
    }

    function loadTasks() {
      return DEFAULT_TASKS;
    }

    function getCategories() {
      return localStorage.getItem(config.storageKeys.categories);
    }

    function saveCategories(data) {
      localStorage.setItem(config.storageKeys.categories, data);
    }

    function getRoutines() {
      return localStorage.getItem(config.storageKeys.routines);
    }

    function saveRoutines(data) {
      localStorage.setItem(config.storageKeys.routines, data);
    }

    function getSettings() {
      return localStorage.getItem(config.storageKeys.settings);
    }

    function saveSettings(settings) {
      localStorage.setItem(config.storageKeys.settings, settings);
    }

    function exit() {
      alert("Fechando aplicação...");
    }

    return {
      ...config,
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
  };

  const TaskerEnvironment = () => {
    const config = {
      name: "tasker",
      langCode: tk.local("sys_lang_code") || "en",
      workDir: "%project_path",
      iconPath: "content://net.dinglisch.android.taskerm.iconprovider//app/"
    };

    const state = { priority: 50 };

    function validateData(data) {
      const isValid = !data.match(/^%[a-z_]+/);
      return isValid ? data : null;
    }

    function executeHandleAction(action, data = "") {
      tk.performTask(
        "RF 06 - HANDLE ACTIONS",
        ++state.priority,
        action,
        data,
        "",
        true,
        true,
        "",
        true
      );
    }

    function loadLang(code) {
      const storedLanguage = tk.shell(
        `cat "${config.workDir}/src/locales/${code}.json" 2>/dev/null`,
        false,
        2000
      );
      if (!storedLanguage) throw new Error("");
      return JSON.parse(storedLanguage);
    }

    function loadApps() {
      executeHandleAction("load_apps");
      return [];
    }

    function loadTasks() {
      executeHandleAction("load_tasks");
      return [];
    }

    function getCategories() {
      const data = tk.local("category_data");
      return validateData(data);
    }

    function saveCategories(data) {
      executeHandleAction("update_categories", data);
    }

    function getRoutines() {
      const data = tk.local("routine_data");
      return validateData(data);
    }

    function saveRoutines(data) {
      executeHandleAction("update_routines", data);
    }

    function getSettings() {
      return tk.global("RF_SETTINGS");
    }

    function saveSettings(settings) {
      tk.setGlobal("RF_SETTINGS", settings);
    }

    return {
      ...config,
      loadLang,
      loadApps,
      loadTasks,
      getCategories,
      saveCategories,
      getRoutines,
      saveRoutines,
      getSettings,
      saveSettings
    };
  };

  function detect() {
    return typeof tk === "undefined" ? WebEnvironment() : TaskerEnvironment();
  }

  return {
    detect
  };
})();

const ENV = EnvironmentManager.detect();
