const SettingsModal = (() => {
  const elements = {
    btn: DOM.$("#settings-btn"),
    modal: DOM.$("#settings-modal"),
    closeBtn: DOM.$("#settings-modal-close"),
    overlay: DOM.$("#settings-modal .modal-overlay")
  };

  function open() {
    Modal.show(elements.modal);
  }

  function close() {
    Modal.hide(elements.modal);
  }

  const handlers = {
    close: close,
    button: open,
    overlay: close
  };

  function bindEvents() {
    const bindings = [
      [elements.btn, "click", handlers.button],
      [elements.closeBtn, "click", handlers.close],
      [elements.overlay, "click", handlers.overlay]
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
