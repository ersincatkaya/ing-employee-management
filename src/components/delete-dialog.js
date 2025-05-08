import {LitElement, html, css} from 'lit';

export class DeleteDialog extends LitElement {
  static properties = {
    open: {type: Boolean},
    employee: {type: Object},
  };

  static styles = css`
    .dialog {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .content {
      background: white;
      padding: 24px;
      border-radius: 8px;
      width: 300px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    h3 {
      margin-top: 0;
      color: #f56600;
    }

    .buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }

    button {
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      border-radius: 4px;
      border: none;
    }

    .cancel {
      background-color: #eee;
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

  _confirm() {
    this.dispatchEvent(
      new CustomEvent('confirm-delete', {
        detail: this.employee,
        bubbles: true,
        composed: true,
      })
    );
  }

  _cancel() {
    this.dispatchEvent(
      new CustomEvent('cancel-delete', {
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.open || !this.employee) return html``;
    return html`
      <div class="dialog" @click=${this._cancel}>
        <div class="content" @click=${(e) => e.stopPropagation()}>
          <h3>Are you sure?</h3>
          <p>
            Selected Employee record of
            <strong
              >${this.employee.firstName} ${this.employee.lastName}</strong
            >
            will be deleted
          </p>
          <div class="buttons">
            <button class="cancel" @click=${this._cancel}>Cancel</button>
            <button class="proceed" @click=${this._confirm}>Proceed</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('delete-dialog', DeleteDialog);
