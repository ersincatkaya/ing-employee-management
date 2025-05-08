import {LitElement, html, css} from 'lit';

export class DeleteDialog extends LitElement {
  static properties = {
    open: {type: Boolean},
    employee: {type: Object},
  };

  static styles = css`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .dialog {
      background: white;
      padding: 24px;
      border-radius: 8px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      border: 2px solid #007bff;
    }

    .dialog h3 {
      margin-top: 0;
      color: #f56600;
    }

    .message {
      margin: 16px 0;
      color: #444;
      font-size: 14px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    button {
      padding: 8px 14px;
      font-size: 14px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .cancel {
      background-color: #e0e0e0;
      color: #333;
    }

    .proceed {
      background-color: #f56600;
      color: white;
    }
  `;

  constructor() {
    super();
    this.open = false;
    this.employee = null;
  }

  show(employee) {
    this.employee = employee;
    this.open = true;
  }

  _close() {
    this.open = false;
    this.employee = null;
  }

  _proceed() {
    this.dispatchEvent(
      new CustomEvent('confirm-delete', {
        detail: this.employee,
        bubbles: true,
        composed: true,
      })
    );
    this._close();
  }

  render() {
    if (!this.open) return html``;

    return html`
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${(e) => e.stopPropagation()}>
          <h3>Are you sure?</h3>
          <div class="message">
            Selected Employee record of
            <strong
              >${this.employee?.firstName} ${this.employee?.lastName}</strong
            >
            will be deleted.
          </div>
          <div class="actions">
            <button class="cancel" @click=${this._close}>Cancel</button>
            <button class="proceed" @click=${this._proceed}>Proceed</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('delete-dialog', DeleteDialog);
