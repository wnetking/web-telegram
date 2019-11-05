const style = `
  display: inline-block;
  box-sizing: border-box;
  padding: 18px;
  border: none;
  border-radius: 10px;
  text-transform: uppercase;
  background-color: #4da3f6;
  color: #fff;
  outline: none;
  font-weight: 700;
`;

window.customElements.define(
  'app-button',
  class extends HTMLButtonElement {
    constructor() {
      super(); // always call super() first in the constructor.
      this.addEventListener('click', e =>
        this.drawRipple(e.offsetX, e.offsetY)
      );
      this.setAttribute('style', style);
    }

    // Material design ripple animation.
    drawRipple(x, y) {
      let div = document.createElement('div');
      div.classList.add('ripple');
      this.appendChild(div);
      div.style.top = `${y - div.clientHeight / 2}px`;
      div.style.left = `${x - div.clientWidth / 2}px`;
      div.style.backgroundColor = 'currentColor';
      div.classList.add('run');
      div.addEventListener('transitionend', e => div.remove());
    }
  },
  { extends: 'button' }
);
