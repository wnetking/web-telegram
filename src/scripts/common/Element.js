class AppElement extends HTMLElement {
  constructor() {
    super();
    this.onStoreUpdateHandler = this.onStoreUpdateHandler.bind(this);
    document.addEventListener('storeUpdate', this.onStoreUpdateHandler);
  }

  onStoreUpdateHandler(e) {
    const { detail } = e;
    this.storeUpdate(detail.prev, detail.next, detail.lastAction);
  }

  disconnectedCallback() {}

  storeUpdate(prev, next, lastAction) {}
}

window.AppElement = AppElement;
