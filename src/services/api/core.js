class Core {
  emmit(eventName, payload) {
    const event = new CustomEvent(eventName, { detail: payload });
    document.dispatchEvent(event);
  }
}

const core = new Core();

export default core;