class AppElement extends HTMLElement {
  constructor() {
    super();
    document.addEventListener('storeUpdate', e => {
      const { detail } = e;
      this.storeUpdate(detail);
    });
  }

  storeUpdate(detail) {}
}

window.AppElement = AppElement;
