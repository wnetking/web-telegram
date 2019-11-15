import core, { Element } from '../../services/api/core';
import positions from './flagPositions';

const template = document.createElement('template');

template.innerHTML = `
<style>
  :host {
    display: inline-block;
    min-width: 23px;
  }
  [class^=flag_]{display:inline-block;width:23px;height:18px;background-image:url(./public/images/flags.png);background-repeat:no-repeat;vertical-align:middle;margin-top:-1px}.card_head .comiseo-daterangepicker-triggerbutton[class^=flag_],[class^=flag_].smaller{display:inline-block;margin-top:-1px;transform:scale(.78);vertical-align:middle;margin-left:-.3rem;margin-right:-.1rem}
</style>
<span class="flag_"></span>
`;

class FlagItem extends Element {
  constructor() {
    super();
    this.makeShadow(template);
    this.$icon = this.shadow.$('span');
  }

  connectedCallback() {
    this.$icon.setAttribute('style', `background-position: ${positions[this.getAttribute('icon')]}`);
  }
}

export default FlagItem;
