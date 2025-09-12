const TimeWatcher = (() => {
  const MS_TO_SECONDS = 1000;
  const CHECK_INTERVAL = 1000;

  let intervalId = null;
  let nextTimestamp = Infinity;

  function setNext(timestamp) {
    nextTimestamp = timestamp;
  }

  function checkTime() {
    const now = Math.floor(Date.now() / MS_TO_SECONDS);
    if (now >= nextTimestamp) {
      EventBus.emit("routine:performed");
    }
  }

  function init() {
    intervalId = setInterval(checkTime, CHECK_INTERVAL);
  }

  return { init, setNext };
})();
