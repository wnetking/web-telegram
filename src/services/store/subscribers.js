import store, { subscribe } from './index';

let currentValue;
function handleChange() {
  let previousValue = currentValue;
  currentValue = store.getState();

  const event = new CustomEvent('storeUpdate', {
    detail: {
      prev: previousValue,
      next: currentValue,
      lastAction: currentValue.lastAction
    }
  });

  document.dispatchEvent(event);
}

const unsubscribe = subscribe(handleChange);
