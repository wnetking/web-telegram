import './ChatMessage';
import * as a from '../../../services/store/actions/chatActions';

const template = document.createElement('template');

template.innerHTML = `
    <style>
      :host {
        position: relative;
        max-height: 100vh;
        overflow-y: auto;
        color: #161616;
      }

      app-loader{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .messages {
        display: flex;
        flex-direction: column;
        margin-left: 5rem;
        margin-right: 5rem;
      }

      app-chat-message{
        background-color: white;
        max-width: 60%;
        align-self: flex-start;
      }

      .own-message{
        align-self: flex-end;
        background-color: #edfadd;
        border-radius-right-bottom: 0;
      }

      .has-arrow{
        position:relative;
      }

      .has-arrow:before{
        content: "";
        position: absolute;
        width: 0px;
        height: 0px;
        border-top: 15px solid transparent;
        border-bottom: 15px solid white;
        bottom: 0px;
      }

      .has-arrow:not(.own-message):before{
        border-left: 10px solid transparent;
        left: -5px;
      }

      .has-arrow.own-message:before{
        border-right: 10px solid transparent;
        border-bottom-color: #edfadd;
        border-top: 15px solid transparent;
        right: -5px;
      }

      app-chat-message{
        margin-bottom: 5px;
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
      this.setChatHistoryToStoreHandler = this.setChatHistoryToStoreHandler.bind(
        this
      );
      this.getChatHistoryRequestHandler = this.getChatHistoryRequestHandler.bind(
        this
      );

      this.addEventListener('scroll', a.getChatHistoryOnScroll);
    }

    connectedCallback() {
      document.addEventListener(
        'chat.getChatHistoryRequest',
        this.getChatHistoryRequestHandler
      );
      document.addEventListener(
        'chat.setChatHistoryToStore',
        this.setChatHistoryToStoreHandler
      );
      document.addEventListener(
        'chat.getChatHistoryRequest',
        this.getChatHistoryRequestHandler
      );

      document.addEventListener('chat.updateChatHistory', ({ detail }) => {
        const wrap = this._shadowRoot.querySelector('.messages');
        const messages = this.getMessagesNodes(
          detail.action.payload,
          detail.store
        );

        wrap.prepend(messages);
      });
    }

    disconnectedCallback() {
      document.removeEventListener(
        'chat.getChatHistoryRequest',
        this.getChatHistoryRequestHandler
      );
    }

    getChatHistoryRequestHandler() {
      if (!this.$loader) {
        this.$wrap.innerHTML = '<app-loader big></app-loader>';
      }
    }

    setChatHistoryToStoreHandler({ detail }) {
      if (this.$loader) {
        this.$loader.remove();
      }

      const messageInfo = detail.action.payload.data;
      this.render(messageInfo, detail.store);
    }

    hasArrow(current, prev, next) {
      if (!next) {
        return true;
      }

      if (current.sender_user_id !== next.sender_user_id) {
        return true;
      }

      return false;
    }

    getMessagesNodes(data, store) {
      const fragment = document.createDocumentFragment();
      (data.messages || []).reverse().forEach((message, index) => {
        const isOutgoing = message.sender_user_id === store.options.my_id.value;
        let messageNode = document.createElement('app-chat-message');
        messageNode.message = message;
        const hasArrow = this.hasArrow(
          message,
          data.messages[index - 1],
          data.messages[index + 1]
        );

        if (hasArrow) {
          messageNode.classList.add('has-arrow');
        }

        if (isOutgoing) {
          messageNode.classList.add('own-message');
        }

        fragment.appendChild(messageNode);
      });

      return fragment;
    }

    render(data, store) {
      //временно
      this.$wrap.innerHTML = '';
      const messagesWrap = document.createElement('div'); // assuming ul exists
      messagesWrap.classList.add('messages');

      const messages = this.getMessagesNodes(data, store);

      messagesWrap.appendChild(messages);
      this.$wrap.appendChild(messagesWrap);

      this.scroll(0, this.scrollHeight);
    }
  }
);
