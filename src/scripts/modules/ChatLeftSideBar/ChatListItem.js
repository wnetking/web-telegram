import * as a from '../../../services/store/actions/chatActions';
import './LastMessage';

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

    .wrap:hover{
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

window.customElements.define(
  'app-chat-left-list-item',
  class extends AppElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._data;
      this.$wrap = this._shadowRoot.querySelector('.wrap');
      this.onWrapClickHandler = this.onWrapClickHandler.bind(this);

      this.$wrap.addEventListener('click', this.onWrapClickHandler);
      this.setChatHistoryToStoreHandler = this.setChatHistoryToStoreHandler.bind(
        this
      );

      document.addEventListener(
        'chat.setChatHistoryToStore',
        this.setChatHistoryToStoreHandler
      );
    }

    setChatHistoryToStoreHandler({ detail }) {}

    connectedCallback() {
      this.render();
    }

    disconnectedCallback() {
      this.$wrap.removeEventListener('click', this.onWrapClickHandler);
      document.removeEventListener(
        'chat.setChatHistoryToStore',
        this.setChatHistoryToStoreHandler
      );
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
        chat_id: this.id,
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
      this.setAttribute('updateKey', 'ne key');
    }

    setLastMessage() {
      const lastMessageNode = this._shadowRoot.querySelector(
        'app-chat-item-last-message'
      );
      lastMessageNode.message = this._data.last_message;
    }

    render() {
      this.$wrap.innerHTML = `
          <div class="thumb">
          <img src="./public/images/telegram.svg" alt="thumb"/>
          </div>
          <div class="details">
          <h3 class="title">${this._data.title}</h3>
          <app-chat-item-last-message></app-chat-item-last-message>
          </div>
      `;
      this.setLastMessage();
    }
  }
);
