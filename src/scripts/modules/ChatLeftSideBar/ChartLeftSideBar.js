import './ChatListItem';
import { api, store } from '../../../services';
// import mock from './mock';

// const chats = new Map(mock);
// console.log('chats', chats);

window.store = store;
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
    <slot></slot>
`;

window.customElements.define(
  'app-chat-left-sidebar',
  class extends AppElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$loader = this._shadowRoot.querySelector('app-loader');
      store.chats = new Map();
    }

    connectedCallback() {
      api
        .send({
          '@type': 'getChats',
          offset_chat_id: 0,
          offset_order: '9223372036854775807',
          limit: 10
        })
        .then(data => {
          this.loadChats(data.chat_ids);
        })
        .catch(error => {
          console.err('getChats', error);
        });

      // chats.forEach((chat, chatId) => {
      //   this.renderChat(chat, chatId);
      // });
    }

    loadChats(chatsId = []) {
      chatsId.forEach(this.loadChat.bind(this));
    }

    loadChat(chatId) {
      api
        .send({
          '@type': 'getChat',
          chat_id: chatId
        })
        .then(data => {
          store.chats.set(chatId, data);

          if (this.$loader) {
            this.$loader.remove();
          }

          this.renderChat(data, chatId);
        });
    }

    renderChat(chat, chatId) {
      const chatNode = document.createElement('app-chat-left-list-item');
      chatNode.data = chat;
      chatNode.id = chatId;

      this.appendChild(chatNode);
    }
  }
);
