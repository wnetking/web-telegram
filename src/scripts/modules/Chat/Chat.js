const template = document.createElement('template');

template.innerHTML = `
    <style>
      :host {
        position: relative;
      }

      app-loader{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    </style>
    <div><app-loader big></app-loader></div>
`;

window.customElements.define(
  'app-chat',
  class extends AppElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$loader = this._shadowRoot.querySelector('app-loader');
      this.$wrap = this._shadowRoot.querySelector('div');
    }

    storeUpdate(prev, next, lastAction) {
      if (lastAction.type === 'chat.setChatHistoryToStore') {
        if (this.$loader) {
          this.$loader.remove();
        }

        const messageInfo = next.chat.currentChatMessages;
        this.render(messageInfo);
      }
    }

    render(data) {
      //временно
      this.$wrap.innerHTML = '';
      const fragment = document.createDocumentFragment();
      const ul = document.createElement('ul'); // assuming ul exists

      (data.messages || []).forEach(function(message) {
        var li = document.createElement('li');
        li.textContent = message.content.text ? message.content.text.text : '';
        fragment.appendChild(li);
      });

      ul.appendChild(fragment);
      this.$wrap.appendChild(ul);
    }
  }
);
