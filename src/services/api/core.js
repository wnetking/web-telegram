class Core {
  /**
   * @param {*} eventName
   * @param {*} payload
   * @param {*} [el=document] - element on which the event is dispatch
   * @memberof Core
   */
  emmit(eventName, payload, el = document) {
    const event = new CustomEvent(eventName, { detail: payload });
    el.dispatchEvent(event);
  }

  /**
   * @param {*} eventName
   * @param {*} payload
   * @param {*} [el=document] - element on which the event is dispatch
   * @memberof Core
   */
  on(eventName, handler, el = document) {
    if (typeof handler === 'function') {
      el.addEventListener(eventName, handler);
    }
  }

  /**
   * @param {*} eventName
   * @param {*} payload
   * @param {*} [el=document] - element on which the event is dispatch
   * @memberof Core
   */
  off(eventName, handler, el = document) {
    if (typeof handler === 'function') {
      el.removeEventListener(eventName, handler);
    }
  }
}

const core = new Core();

export default core;
