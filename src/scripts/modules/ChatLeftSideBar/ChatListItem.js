import * as a from '../../../services/store/actions/chatActions';
import core, { Element } from '../../../services/api/core';
import './LastMessage';
import './ChatThumb';

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    position: relative; 

    --size: 75px;
  }

  * {
    box-sizing: border-box;
  }

  .wrap{
    display: flex;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition:background-color 0.2s ease-out;
    margin-left: 7px;
    margin-right: 7px;
  }

  .wrap:hover, .wrap.active{
    background-color: #f4f4f5;
  }

  .ripple{
    z-index: 1;
    position: absolute;
    background-color: #e9e9eb;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    transition: transform 0.2s ease-out;
  }

  .ripple.run{
    transform: scale(30);
  }

  .thumb, .details{
    z-index: 2;
    position: relative;
  }

  .thumb{
    flex-basis: var(--size);
    max-width: var(--size);
    padding: 10px;
  }

  img {
    max-width: 100%;
    border-radius: 50%;
  }

  h3 {
    font-size: 15px;
    margin-top: 17px;
    margin-bottom: 7px;
  }

  .details {
    flex-basis: calc(100% - var(--size)); 
    max-width: calc(100% - var(--size)); 
  }

  .details span, app-chat-item-last-message{
    display: inline-block;
    overflow: hidden;
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #989b9e;
  }
</style>
<div class="wrap"></div>
`;

core.define(
  'app-chat-left-list-item',
  class extends Element {
    constructor() {
      super();
      this.makeShadow(template)
      this._data;
      this.$wrap = this.shadow.$('.wrap');
      this.onWrapClickHandler = this.onWrapClickHandler.bind(this);
      this.setChatHistoryToStoreHandler = this.setChatHistoryToStoreHandler.bind(
        this
      );

      this.$wrap.addEventListener('click', this.onWrapClickHandler);
      code.on('chat.setChatHistoryToStore', this.setChatHistoryToStoreHandler);
    }

    setChatHistoryToStoreHandler({ detail }) {
      const { chat_id } = detail.action.payload;

      if (!chat_id) {
        return;
      }

      if (this.$wrap.classList.contains('active')) {
        this.$wrap.classList.remove('active');
      }

      if (chat_id === this._data.id) {
        this.$wrap.classList.add('active');
      }
    }

    connectedCallback() {
      this.render();
    }

    disconnectedCallback() {
      this.$wrap.removeEventListener('click', this.onWrapClickHandler);
      core.off('chat.setChatHistoryToStore', this.setChatHistoryToStoreHandler);
    }

    static get observedAttributes() {
      return ['updateKey'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'updateKey') {
        this.render();
      }
    }

    drawRipple(x, y) {
      let div = document.createElement('div');
      div.classList.add('ripple');
      this.$wrap.prepend(div);
      div.style.top = `${y - div.clientHeight / 2}px`;
      div.style.left = `${x - div.clientWidth / 2}px`;
      div.classList.add('run');
      div.addEventListener('transitionend', e => div.remove());
    }

    onWrapClickHandler(e) {
      this.drawRipple(e.offsetX, e.offsetY);
      a.getChatHistory({
        chat_id: this._data.id,
        from_message_id: this._data.last_message.id || 0
      });
    }

    get id() {
      return this.getAttribute('id');
    }
    set id(value) {
      this.setAttribute('id', value);
    }

    set data(value) {
      this._data = value;
    }

    setLastMessage() {
      const lastMessageNode = this.shadow.$('app-chat-item-last-message');
      lastMessageNode.message = this._data.last_message;
    }

    render() {
      this.$wrap.innerHTML = `
          <div class="thumb"></div>
          <div class="details">
          <h3 class="title">${this._data.title}</h3>
          <app-chat-item-last-message></app-chat-item-last-message>
          </div>
      `;
      this.setLastMessage();
      const thumb = document.createElement('app-chat-thumb');
      thumb.file = this._data.photo ? this._data.photo.small : null;
      const thumbWrap = this.$wrap.querySelector('.thumb');
      thumbWrap.append(thumb);
    }
  }
);
