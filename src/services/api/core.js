class Core {
  emmit(eventName, payload) {
    const event = new CustomEvent(eventName, { detail: payload });
    document.dispatchEvent(event);
  }

  on(eventName, handler = () => { }) { }
  off(eventName, handler = () => { }) { }
}

const core = new Core();

export default core;