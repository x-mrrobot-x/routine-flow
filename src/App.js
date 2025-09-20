const App = (() => {
  async function init() {
    Icons.init();
    await I18n.init();
    RoutineService.init();
    CategoryService.init();
    CategoryRenderer.init();
    RoutineRenderer.init();
    TimeWatcher.init();
    RoutineFilter.init();
    RoutineActions.init();

    SettingsModal.init();
    CategoryModal.init();
    RoutineModal.init();
    DeleteRoutineModal.init();
    TaskPickerModal.init();
    AppPickerModal.init();
    CommandPickerModal.init();
    TimelineModal.init();
  }

  function goBack() {
    return Modal.goBack();
  }

  return {
    init,
    goBack
  };
})();

App.init();
