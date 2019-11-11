import './ChatListItem';
import * as a from '../../../services/store/actions/chatListActions';
import * as chatA from '../../../services/store/actions/chatActions';

// import mock from './mock';

// const chats = new Map(mock);
// console.log('chats', chats);

const template = document.createElement('template');

template.innerHTML = `
    <style>
    :host {
      position: relative;
      max-height: 100vh;
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
      this.setChatInfoHandler = this.setChatInfoHandler.bind(this);
      this.renderFirstChatDetails = true;
    }

    setChatInfoHandler({ detail }) {
      if (this.$loader) {
        this.$loader.remove();
      }
      const chat = Object.values(detail.action.payload)[0];
      this.renderChat(chat, chat.id);

      if (this.renderFirstChatDetails) {
        this.renderFirstChatDetails = false;

        chatA.getChatHistory({
          chat_id: chat.id,
          from_message_id: chat.last_message.id || 0
        });
      }
    }

    connectedCallback() {
      document.addEventListener(
        'chatList.setChatInfo',
        this.setChatInfoHandler
      );
      a.getChatAction({
        offset_chat_id: 0,
        offset_order: '9223372036854775807',
        limit: 10
      });
    }

    renderChat(chat, chatId) {
      if (document.querySelector(`app-chat-left-list-item[id="${chatId}"]`)) {
        return;
      }

      const chatNode = document.createElement('app-chat-left-list-item');
      chatNode.data = chat;
      chatNode.id = chatId;

      this.appendChild(chatNode);
    }
  }
);
