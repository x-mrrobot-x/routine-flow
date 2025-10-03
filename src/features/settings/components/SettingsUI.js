const SettingsUI = (() => {
  const elements = {
    modal: DOM.$("#settings-modal"),
    voiceToggle: DOM.$("#voice-toggle"),
    toastToggle: DOM.$("#toast-toggle"),
    vibrateToggle: DOM.$("#vibrate-toggle"),
    themeSelect: DOM.$("#theme-select")
  };

  function getCurrent() {
    return {
      voice: elements.voiceToggle.checked,
      toast: elements.toastToggle.checked,
      vibrate: elements.vibrateToggle.checked,
      theme: elements.themeSelect.value
    };
  }

  function switchTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function applyTheme(theme) {
    elements.themeSelect.value = theme;
    switchTheme(theme);
  }

  function applyPreferences(settings) {
    elements.voiceToggle.checked = settings.voice;
    elements.toastToggle.checked = settings.toast;
    elements.vibrateToggle.checked = settings.vibrate;
  }

  function applyAll(settings) {
    applyPreferences(settings);
    applyTheme(settings.theme);
  }

  function handleChange(evt) {
    const settings = getCurrent();
    SettingsService.setSettings(settings);

    if (evt.target.id === "theme-select") {
      switchTheme(settings.theme);
    }
  }

  function bindEvents() {
    elements.modal.addEventListener("change", handleChange);
  }

  function init() {
    SettingsService.init();
    const settings = SettingsService.getSettings();
    applyAll(settings);
    bindEvents();
  }

  return {
    init
  };
})();
