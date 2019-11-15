class Element extends HTMLElement {
  constructor() {
    super();
    this._cache = {
      events: {},
    };
  }

  $(selector) {
    return this.querySelector(selector);
  }

  $$(selector) {
    return this.querySelectorAll(selector);
  }

  emmit(eventName, eventDetail, bubbles = true) {
    const eventKey = JSON.stringify(arguments);
    if (!(eventKey in this._cache.events)) {
      const customEventInit = { bubbles };
      if (eventDetail instanceof Object) {
        customEventInit.detail = eventDetail;
      }
      this._cache.events[eventKey] = new CustomEvent(eventName, customEventInit);
    }
    this.dispatchEvent(this._cache.events[eventKey]);
  }

  getTemplateCopy(template = this.template) {
    if (this.template) {
      throw new Error('No have temptale')
    }

    return template.content.cloneNode(true);
  }

  makeShadow(template) {
    this.attachShadow({ mode: "open" });
    const templateClone = this.getTemplateCopy(template);
    this.shadow = this.shadowRoot;
    this.shadow.appendChild(templateClone);
    this.shadow.$ = selector => this.shadow.querySelector(selector);
    this.shadow.$$ = selector => new CustomNodeList(this.shadow.querySelectorAll(selector));
  }
}

export default Element;