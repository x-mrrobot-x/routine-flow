const SettingsService = (() => {
  const DEFAULT_SETTINGS = {
    voice: true,
    toast: true,
    vibrate: false,
    theme: "light"
  };

  let settings = {};

  function getSettings() {
    return settings;
  }

  function setSettings(newSettings) {
    settings = newSettings;
    ENV.saveSettings(JSON.stringify(settings, null, 2));
  }

  function load() {
    const stored = ENV.getSettings();

    if (!stored) {
      setSettings(DEFAULT_SETTINGS);
      return;
    }

    setSettings(JSON.parse(stored));
  }

  function init() {
    load();
  }

  return {
    init,
    getSettings,
    setSettings
  };
})();
