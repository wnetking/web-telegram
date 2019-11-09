const template = document.createElement('template');

template.innerHTML = `
    <style>
      app-chat-container{
        display: flex;
        max-width: 1680px;
        min-height: 100vh;
        margin-left: auto;
        margin-right: auto;
      }

      app-chat-right-sidebar, app-chat-left-sidebar{
        max-width: 25%;
        flex-basis: 25%;
      }

      app-chat-right-sidebar{
        border-left: 1px solid #dadce0;  
        border-right: 1px solid #dadce0;  
      }
      
      app-chat-left-sidebar{
        border-left: 1px solid #dadce0;  
        border-right: 1px solid #dadce0;  
      }

      app-chat{
        max-width: 50%;
        flex-basis: 50%;
        background: #e6ebee;
      }
    </style>
    <app-chat-left-sidebar></app-chat-left-sidebar>
    <app-chat></app-chat>
    <app-chat-right-sidebar></app-chat-right-sidebar>
`;

window.customElements.define(
  'app-chat-container',
  class extends HTMLElement {
    constructor() {
      super();
      this.appendChild(template.content.cloneNode(true));
    }
  }
);
