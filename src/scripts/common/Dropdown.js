import { Input } from './Input';
import core from '../../services/api/core';

let cacheData = null;

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    position: relative;
  }
  .trigger-btn {
    cursor: pointer;
  }

  .drop-down-wrap {
    position: absolute;
    display: none;
    width: 100%;
    top: calc(100% + 10px);
    left: 0;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 10px #ccc; 
  }

  .drop-down-wrap.active{
    display: block;
  }

  app-icon{
    color: #8c959b;
    transition: all 0.1s ease-out;
  }

  input:focus ~ button app-icon {
    transform: rotate(-180deg);
    color: var(--focus-color);
  }

  .drop-down-wrap{

  }

  .drop-down-wrap{
    overflow-y: auto;
    max-height: 300px;
  }

  .drop-down-wrap::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px transparent;
    background-color: transparent;
  }

  .drop-down-wrap::-webkit-scrollbar {
    width: 5px;
    background-color: transparent;
  }

  .drop-down-wrap::-webkit-scrollbar-thumb {
    background-color: #dadce0;
    border-radius: 3px;
  }
</style>
<div class="drop-down-wrap"></div>
`;
const triggerTmp = `
  <button class="trigger-btn"><app-icon icon="down_svg"></app-icon></button>
`;

window.customElements.define(
  'app-chat-country-phone-code',
  class extends Input {
    constructor() {
      super();
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.$inputWrap.insertAdjacentHTML('beforeEnd', triggerTmp);
      this.extendConnectedCallback = this.extendConnectedCallback.bind(this);
      this.toggle = this.toggle.bind(this);
      this.onSelect = this.onSelect.bind(this);
      this.onFocusout = this.onFocusout.bind(this);
      this.onTriggerClick = this.onTriggerClick.bind(this);
      this.isDropdownRendered = false;
    }

    extendConnectedCallback() {
      this.$triggerBtn = this._shadowRoot.querySelector('.trigger-btn');
      this.$dropDownWrap = this._shadowRoot.querySelector('.drop-down-wrap');
      core.on('click', this.onTriggerClick, this.$triggerBtn);
      core.on('focus', this.toggle, this.$input);
      core.on('keyup', this.onKeyup, this.$input);
      core.on('focusout', this.onFocusout, this.$input);
      core.on('focusout', this.onFocusout, this.$input);
    }

    extendDisconnectedCallback() {
      core.off('click', this.onTriggerClick, this.$triggerBtn);
      core.off('focus', this.toggle, this.$input);
      core.off('keyup', this.onKeyup, this.$input);
      core.off('focusout', this.onFocusout, this.$input);
      core.off('focusout', this.onFocusout, this.$input);
    }

    onTriggerClick() {
      this.$input.focus();
    }

    onKeyup(e) {
      core.emmit('phone.dropdowKeyDown', e.target.value);
    }

    onFocusout() {
      setTimeout(() => {
        this.$dropDownWrap.classList.remove('active');
      }, 200);
    }

    onSelect(item) {
      this.$input.value = item.name;
      this.toggle();
      this.keyupHandler({
        target: this.$input
      });

      core.emmit('dropdown.change', item, this);
    }

    load(callback = () => {}) {
      import('./country_data').then(({ default: data }) => {
        cacheData = data;
        callback();
      });
    }

    toggle() {
      if (this.$dropDownWrap.classList.contains('active')) {
        this.$dropDownWrap.classList.remove('active');
      } else {
        if (!this.isDropdownRendered) {
          this.renderDropdown();
        }

        this.$dropDownWrap.classList.add('active');
      }
    }

    renderDropdown() {
      this.load(() => {
        if (!cacheData.countries) {
          return false;
        }

        const { countries } = cacheData;
        const fragment = document.createDocumentFragment();

        countries.forEach(country => {
          const item = document.createElement('app-chat-country-phone-code-item');
          item.data = country;
          item.onSelect = this.onSelect;
          fragment.appendChild(item);
        });

        this.$dropDownWrap.appendChild(fragment);
        this.isDropdownRendered = true;
      });
    }
  }
);

const tm = document.createElement('template');
tm.innerHTML = `
<style>
  * {
    box-sizing: border-box;
  }

  div{
    display: flex;
    padding: 15px;
    transition: all 0.1s ease-out;
    cursor: pointer;
  }

  div.hidden{
    display: none;
  }

  div:hover{
    background-color: #f4f4f5;
  }

  .icon{
    margin-right: 20px;
  }
  .name {
    margin-right: auto;
  }
  .code {
    color: #707478;
  }
</style>
<div></div>
`;
window.customElements.define(
  'app-chat-country-phone-code-item',
  class extends HTMLElement {
    constructor() {
      super();
      this.$shadow = this.attachShadow({ mode: 'open' });
      this.$shadow.appendChild(tm.content.cloneNode(true));
      this.$wrap = this.$shadow.querySelector('div');
      this.dropdowKeyDownH = this.dropdowKeyDownH.bind(this);
      this.onClick = this.onClick.bind(this);
      this.onSelect = null;
      /**
       * {object}
       *
       * dialCode - {string}
       * format
       * hasAreaCodes - {bool}
       * iso2 - {string}
       * name - {string}
       * priority - {number}
       * regions: {array}
       */
      this._data;
    }

    connectedCallback() {
      core.on('click', this.onClick, this.$wrap);
      core.on('phone.dropdowKeyDown', this.dropdowKeyDownH);
    }

    disconnectedCallback() {
      core.off('click', this.onClick, this.$wrap);
      core.off('phone.dropdowKeyDown', this.dropdowKeyDownH);
    }

    onClick() {
      if (!this.onSelect) {
        return false;
      }

      this.onSelect(this._data);
    }

    dropdowKeyDownH({ detail: value }) {
      const { name } = this._data;

      if (!value) {
        return this.$wrap.classList.remove('hidden');
      }

      if (!name.toLowerCase().includes(value.toLowerCase())) {
        this.$wrap.classList.add('hidden');
      }
    }

    set data(val) {
      this._data = val;
      this.renderItem();
    }

    renderItem() {
      this.$wrap.innerHTML = `
        <span class="icon">icon</span> 
        <span class="name">${this._data.name}</span>
        <span class="code">+${this._data.dialCode}</span>
      `;
    }
  }
);

const iconsCSS = `

[class^='flag_'] {
  display: inline-block;
  width: 23px;
  height: 18px;
  background-image: url(/img/flags.png);
  background-repeat: no-repeat;
  vertical-align: middle;
  margin-top: -1px; }
  [class^='flag_'].smaller, .card_head .comiseo-daterangepicker-triggerbutton[class^='flag_'] {
    display: inline-block;
    margin-top: -1px;
    transform: scale(0.78);
    vertical-align: middle;
    margin-left: -0.3rem;
    margin-right: -0.1rem; }

.flag_ad {
  background-position: -5px -5px; }

.flag_ae {
  background-position: -5px -32px; }

.flag_af {
  background-position: -5px -59px; }

.flag_ag {
  background-position: -5px -86px; }

.flag_ai {
  background-position: -5px -113px; }

.flag_al {
  background-position: -5px -140px; }

.flag_am {
  background-position: -5px -167px; }

.flag_ao {
  background-position: -5px -194px; }

.flag_ar {
  background-position: -5px -221px; }

.flag_as {
  background-position: -5px -248px; }

.flag_at {
  background-position: -5px -275px; }

.flag_au {
  background-position: -5px -302px; }

.flag_ax {
  background-position: -5px -329px; }

.flag_az {
  background-position: -5px -356px; }

.flag_ba {
  background-position: -5px -383px; }

.flag_bb {
  background-position: -5px -410px; }

.flag_bd {
  background-position: -5px -437px; }

.flag_be {
  background-position: -5px -464px; }

.flag_bf {
  background-position: -5px -491px; }

.flag_bg {
  background-position: -5px -518px; }

.flag_bh {
  background-position: -5px -545px; }

.flag_bi {
  background-position: -5px -572px; }

.flag_bj {
  background-position: -5px -599px; }

.flag_bl {
  background-position: -5px -626px; }

.flag_bm {
  background-position: -5px -653px; }

.flag_bn {
  background-position: -5px -680px; }

.flag_bo {
  background-position: -5px -707px; }

.flag_br {
  background-position: -5px -734px; }

.flag_bs {
  background-position: -5px -761px; }

.flag_bt {
  background-position: -5px -788px; }

.flag_bv {
  background-position: -5px -815px; }

.flag_bw {
  background-position: -5px -842px; }

.flag_by {
  background-position: -5px -869px; }

.flag_bz {
  background-position: -5px -896px; }

.flag_ca {
  background-position: -5px -923px; }

.flag_cc {
  background-position: -5px -950px; }

.flag_cd {
  background-position: -5px -977px; }

.flag_cf {
  background-position: -5px -1004px; }

.flag_cg {
  background-position: -5px -1031px; }

.flag_ch {
  background-position: -5px -1058px; }

.flag_ch2 {
  background-position: -5px -1085px; }

.flag_ci {
  background-position: -5px -1112px; }

.flag_ck {
  background-position: -5px -1139px; }

.flag_cl {
  background-position: -5px -1166px; }

.flag_cm {
  background-position: -5px -1193px; }

.flag_cn {
  background-position: -5px -1220px; }

.flag_co {
  background-position: -5px -1247px; }

.flag_cr {
  background-position: -5px -1274px; }

.flag_cu {
  background-position: -5px -1301px; }

.flag_cv {
  background-position: -5px -1328px; }

.flag_cw {
  background-position: -5px -1355px; }

.flag_cx {
  background-position: -5px -1382px; }

.flag_cy {
  background-position: -5px -1409px; }

.flag_cz {
  background-position: -5px -1436px; }

.flag_de {
  background-position: -5px -1463px; }

.flag_dj {
  background-position: -5px -1490px; }

.flag_dk {
  background-position: -5px -1517px; }

.flag_dm {
  background-position: -5px -1544px; }

.flag_do {
  background-position: -5px -1571px; }

.flag_dz {
  background-position: -5px -1598px; }

.flag_ec {
  background-position: -5px -1625px; }

.flag_ee {
  background-position: -5px -1652px; }

.flag_eg {
  background-position: -5px -1679px; }

.flag_er {
  background-position: -5px -1706px; }

.flag_es {
  background-position: -5px -1733px; }

.flag_et {
  background-position: -5px -1760px; }

.flag_eu {
  background-position: -5px -1787px; }

.flag_fi {
  background-position: -5px -1814px; }

.flag_fj {
  background-position: -5px -1841px; }

.flag_fk {
  background-position: -5px -1868px; }

.flag_fm {
  background-position: -5px -1895px; }

.flag_fr {
  background-position: -5px -1922px; }

.flag_ga {
  background-position: -5px -1949px; }

.flag_en,
.flag_uk,
.flag_gb {
  background-position: -5px -1976px; }

.flag_gb_eng {
  background-position: -5px -2003px; }

.flag_gb_nir {
  background-position: -5px -2030px; }

.flag_gb_sct {
  background-position: -5px -2057px; }

.flag_gb_wls {
  background-position: -5px -2084px; }

.flag_gd {
  background-position: -5px -2111px; }

.flag_ge {
  background-position: -5px -2138px; }

.flag_gf {
  background-position: -5px -2165px; }

.flag_gg {
  background-position: -5px -2192px; }

.flag_gh {
  background-position: -5px -2219px; }

.flag_gi {
  background-position: -5px -2246px; }

.flag_gl {
  background-position: -5px -2273px; }

.flag_gm {
  background-position: -5px -2300px; }

.flag_gn {
  background-position: -5px -2327px; }

.flag_gp {
  background-position: -5px -2354px; }

.flag_gq {
  background-position: -5px -2381px; }

.flag_gr {
  background-position: -5px -2408px; }

.flag_gt {
  background-position: -5px -2435px; }

.flag_gu {
  background-position: -5px -2462px; }

.flag_gw {
  background-position: -5px -2489px; }

.flag_gy {
  background-position: -5px -2516px; }

.flag_hk {
  background-position: -5px -2543px; }

.flag_hm {
  background-position: -5px -2570px; }

.flag_hn {
  background-position: -5px -2597px; }

.flag_hr {
  background-position: -5px -2624px; }

.flag_ht {
  background-position: -5px -2651px; }

.flag_hu {
  background-position: -5px -2678px; }

.flag_id {
  background-position: -5px -2705px; }

.flag_ie {
  background-position: -5px -2732px; }

.flag_il {
  background-position: -5px -2759px; }

.flag_im {
  background-position: -5px -2786px; }

.flag_in {
  background-position: -5px -2813px; }

.flag_io {
  background-position: -5px -2840px; }

.flag_iq {
  background-position: -5px -2867px; }

.flag_ir {
  background-position: -5px -2894px; }

.flag_is {
  background-position: -5px -2921px; }

.flag_it {
  background-position: -5px -2948px; }

.flag_je {
  background-position: -5px -2975px; }

.flag_jm {
  background-position: -5px -3002px; }

.flag_jo {
  background-position: -5px -3029px; }

.flag_jp {
  background-position: -5px -3056px; }

.flag_ke {
  background-position: -5px -3083px; }

.flag_kg {
  background-position: -5px -3110px; }

.flag_kh {
  background-position: -5px -3137px; }

.flag_ki {
  background-position: -5px -3164px; }

.flag_km {
  background-position: -5px -3191px; }

.flag_kn {
  background-position: -5px -3218px; }

.flag_kp {
  background-position: -5px -3245px; }

.flag_kr {
  background-position: -5px -3272px; }

.flag_kw {
  background-position: -5px -3299px; }

.flag_ky {
  background-position: -5px -3326px; }

.flag_kz {
  background-position: -5px -3353px; }

.flag_la {
  background-position: -5px -3380px; }

.flag_lb {
  background-position: -5px -3407px; }

.flag_lc {
  background-position: -5px -3434px; }

.flag_lgbt {
  background-position: -5px -3461px; }

.flag_li {
  background-position: -5px -3488px; }

.flag_lk {
  background-position: -5px -3515px; }

.flag_lr {
  background-position: -5px -3542px; }

.flag_ls {
  background-position: -5px -3569px; }

.flag_lt {
  background-position: -5px -3596px; }

.flag_lu {
  background-position: -5px -3623px; }

.flag_lv {
  background-position: -5px -3650px; }

.flag_ly {
  background-position: -5px -3677px; }

.flag_ma {
  background-position: -5px -3704px; }

.flag_mc {
  background-position: -5px -3731px; }

.flag_md {
  background-position: -5px -3758px; }

.flag_me {
  background-position: -5px -3785px; }

.flag_mg {
  background-position: -5px -3812px; }

.flag_mh {
  background-position: -5px -3839px; }

.flag_mk {
  background-position: -5px -3866px; }

.flag_ml {
  background-position: -5px -3893px; }

.flag_mm {
  background-position: -5px -3920px; }

.flag_mn {
  background-position: -5px -3947px; }

.flag_mo {
  background-position: -5px -3974px; }

.flag_mp {
  background-position: -5px -4001px; }

.flag_mr {
  background-position: -5px -4028px; }

.flag_ms {
  background-position: -5px -4055px; }

.flag_mt {
  background-position: -5px -4082px; }

.flag_mu {
  background-position: -5px -4109px; }

.flag_mv {
  background-position: -5px -4136px; }

.flag_mw {
  background-position: -5px -4163px; }

.flag_mx {
  background-position: -5px -4190px; }

.flag_my {
  background-position: -5px -4217px; }

.flag_mz {
  background-position: -5px -4244px; }

.flag_na {
  background-position: -5px -4271px; }

.flag_nc {
  background-position: -5px -4298px; }

.flag_ne {
  background-position: -5px -4325px; }

.flag_nf {
  background-position: -5px -4352px; }

.flag_ng {
  background-position: -5px -4379px; }

.flag_ni {
  background-position: -5px -4406px; }

.flag_nl {
  background-position: -5px -4433px; }

.flag_no {
  background-position: -5px -4460px; }

.flag_np {
  background-position: -5px -4487px; }

.flag_nr {
  background-position: -5px -4514px; }

.flag_nu {
  background-position: -5px -4541px; }

.flag_nz {
  background-position: -5px -4568px; }

.flag_om {
  background-position: -5px -4595px; }

.flag_pa {
  background-position: -5px -4622px; }

.flag_pe {
  background-position: -5px -4649px; }

.flag_pf {
  background-position: -5px -4676px; }

.flag_pg {
  background-position: -5px -4703px; }

.flag_ph {
  background-position: -5px -4730px; }

.flag_pk {
  background-position: -5px -4757px; }

.flag_pl {
  background-position: -5px -4784px; }

.flag_pm {
  background-position: -5px -4811px; }

.flag_pn {
  background-position: -5px -4838px; }

.flag_pr {
  background-position: -5px -4865px; }

.flag_ps {
  background-position: -5px -4892px; }

.flag_pt {
  background-position: -5px -4919px; }

.flag_pw {
  background-position: -5px -4946px; }

.flag_py {
  background-position: -5px -4973px; }

.flag_qa {
  background-position: -5px -5000px; }

.flag_re {
  background-position: -5px -5027px; }

.flag_ro {
  background-position: -5px -5054px; }

.flag_rs {
  background-position: -5px -5081px; }

.flag_ru {
  background-position: -5px -5108px; }

.flag_rw {
  background-position: -5px -5135px; }

.flag_sa {
  background-position: -5px -5162px; }

.flag_sb {
  background-position: -5px -5189px; }

.flag_sc {
  background-position: -5px -5216px; }

.flag_sd {
  background-position: -5px -5243px; }

.flag_se {
  background-position: -5px -5270px; }

.flag_se_ska {
  background-position: -5px -5297px; }

.flag_sg {
  background-position: -5px -5324px; }

.flag_si {
  background-position: -5px -5351px; }

.flag_sj {
  background-position: -5px -5378px; }

.flag_sk {
  background-position: -5px -5405px; }

.flag_sl {
  background-position: -5px -5432px; }

.flag_sm {
  background-position: -5px -5459px; }

.flag_sn {
  background-position: -5px -5486px; }

.flag_so {
  background-position: -5px -5513px; }

.flag_sr {
  background-position: -5px -5540px; }

.flag_ss {
  background-position: -5px -5567px; }

.flag_st {
  background-position: -5px -5594px; }

.flag_sv {
  background-position: -5px -5621px; }

.flag_sx {
  background-position: -5px -5648px; }

.flag_sy {
  background-position: -5px -5675px; }

.flag_sz {
  background-position: -5px -5702px; }

.flag_tc {
  background-position: -5px -5729px; }

.flag_td {
  background-position: -5px -5756px; }

.flag_tf {
  background-position: -5px -5783px; }

.flag_tg {
  background-position: -5px -5810px; }

.flag_th {
  background-position: -5px -5837px; }

.flag_tj {
  background-position: -5px -5864px; }

.flag_tl {
  background-position: -5px -5891px; }

.flag_tm {
  background-position: -5px -5918px; }

.flag_tn {
  background-position: -5px -5945px; }

.flag_to {
  background-position: -5px -5972px; }

.flag_tr {
  background-position: -5px -5999px; }

.flag_tt {
  background-position: -5px -6026px; }

.flag_tw {
  background-position: -5px -6053px; }

.flag_tz {
  background-position: -5px -6080px; }

.flag_ua {
  background-position: -5px -6107px; }

.flag_ug {
  background-position: -5px -6134px; }

.flag_um {
  background-position: -5px -6161px; }

.flag_us {
  background-position: -5px -6188px; }

.flag_us_ca {
  background-position: -5px -6215px; }

.flag_uy {
  background-position: -5px -6242px; }

.flag_uz {
  background-position: -5px -6269px; }

.flag_va {
  background-position: -5px -6296px; }

.flag_vc {
  background-position: -5px -6323px; }

.flag_ve {
  background-position: -5px -6350px; }

.flag_vg {
  background-position: -5px -6377px; }

.flag_vi {
  background-position: -5px -6404px; }

.flag_vn {
  background-position: -5px -6431px; }

.flag_vu {
  background-position: -5px -6458px; }

.flag_wf {
  background-position: -5px -6485px; }

.flag_ws {
  background-position: -5px -6512px; }

.flag_ww {
  background-position: -5px -6539px; }

.flag_ww_afr {
  background-position: -5px -6566px; }

.flag_ww_asi {
  background-position: -5px -6593px; }

.flag_ww_aus {
  background-position: -5px -6620px; }

.flag_ww_eur {
  background-position: -5px -6647px; }

.flag_ww_nam {
  background-position: -5px -6674px; }

.flag_ww_sam {
  background-position: -5px -6701px; }

.flag_xk {
  background-position: -5px -6728px; }

.flag_ye {
  background-position: -5px -6755px; }

.flag_yt {
  background-position: -5px -6782px; }

.flag_za {
  background-position: -5px -6809px; }

.flag_zm {
  background-position: -5px -6836px; }

.flag_zw {
  background-position: -5px -6863px; }

`;
