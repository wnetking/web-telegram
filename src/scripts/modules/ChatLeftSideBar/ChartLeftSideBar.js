import './ChatListItem';
import * as a from '../../../services/store/actions/chatListActions';
import * as chatA from '../../../services/store/actions/chatActions';
import core, { Element } from '../../../services/api/core';

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

core.define(
  'app-chat-left-sidebar',
  class extends Element {
    constructor() {
      super();
      this.makeShadow(template);
      this.$loader = this.shadow.$('app-loader');
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

      this.addEventListener('scroll', a.getChatListOnScroll);
    }

    connectedCallback() {
      core.on('chatList.setChatInfo', this.setChatInfoHandler);
      a.getChatAction({
        offset_chat_id: 0,
        offset_order: '9223372036854775807',
        limit: 30
      });
    }

    disconnectedCallback() {
      core.off('chatList.setChatInfo', this.setChatInfoHandler);
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
