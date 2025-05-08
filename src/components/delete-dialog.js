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
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .dialog {
      background: white;
      padding: 24px;
      border-radius: 8px;
      width: 300px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .dialog h3 {
      margin-top: 0;
      font-size: 18px;
      color: #ff6600;
    }

    .dialog p {
      font-size: 14px;
      margin-bottom: 20px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .cancel-btn {
      background: #e0e0e0;
      color: #333;
      border: none;
      padding: 8px 12px;
      cursor: pointer;
    }

    .delete-btn {
      background: #ff6600;
      color: white;
      border: none;
      padding: 8px 12px;
      cursor: pointer;
    }
  `;

  constructor() {
    super();
    this.open = false;
    this.employee = null;
  }

  render() {
    if (!this.open || !this.employee) return html``;

    return html`
      <div class="overlay" @click=${this._cancel}>
        <div class="dialog" @click=${(e) => e.stopPropagation()}>
          <h3>Are you sure?</h3>
          <p>
            Selected Employee record of
            <b>${this.employee.firstName} ${this.employee.lastName}</b> will be
            deleted
          </p>
          <div class="actions">
            <button class="cancel-btn" @click=${this._cancel}>Cancel</button>
            <button class="delete-btn" @click=${this._confirm}>Proceed</button>
          </div>
        </div>
      </div>
    `;
  }

  _cancel() {
    this.dispatchEvent(
      new CustomEvent('cancel-delete', {bubbles: true, composed: true})
    );
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
}

customElements.define('delete-dialog', DeleteDialog);
