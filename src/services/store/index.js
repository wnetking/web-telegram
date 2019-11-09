/**
 * @description
 * @param {*} [initialState={}]
 * @returns
 */
function createStore(initialState = {}) {
  const handlers = {
    set(target, prop, val) {
      target[prop] = val;

      const event = new CustomEvent('storeUpdate', {
        detail: { store: target, updateProperty: { prop, val } }
      });

      document.dispatchEvent(event);

      return true;
    },

    deleteProperty(target, prop) {
      const event = new CustomEvent('storeUpdate', {
        detail: { store: target, deleteProperty: { prop, val } }
      });
      document.dispatchEvent(event);

      return true;
    }
  };

  return new Proxy(initialState, handlers);
}

const store = createStore();

export default store;
