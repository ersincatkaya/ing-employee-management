import {LitElement, html, css} from 'lit';
import '../employee-form.js';

export class EmployeeDialog extends LitElement {
  static properties = {
    open: {type: Boolean},
  };

  static styles = css`
    dialog {
      border: none;
      border-radius: 8px;
      padding: 0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.3);
    }
    .close-btn {
      position: absolute;
      top: 10px;
      right: 15px;
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
    }
  `;

  constructor() {
    super();
    this.open = false;
  }

  updated(changedProps) {
    if (changedProps.has('open')) {
      const dialog = this.shadowRoot.querySelector('dialog');
      if (this.open) dialog.showModal();
      else dialog.close();
    }
  }

  render() {
    return html`
      <dialog @close=${() => (this.open = false)}>
        <button class="close-btn" @click=${this._close}>x</button>
        <employee-form></employee-form>
      </dialog>
    `;
  }

  _close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('dialog-closed'));
  }
}

customElements.define('employee-dialog', EmployeeDialog);
