import {LitElement, html, css} from 'lit';
import '../employee-form.js';

export class EmployeeDialog extends LitElement {
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
      max-width: 500px;
      width: 100%;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .header h3 {
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
    }
  `;

  render() {
    return html`
      <div class="overlay" @click=${this._closeOutside}>
        <div class="dialog" @click=${(e) => e.stopPropagation()}>
          <div class="header">
            <h3>Add New Employee</h3>
            <button class="close-btn" @click=${this._closeDialog}>
              &times;
            </button>
          </div>
          <employee-form @submit-done=${this._closeDialog}></employee-form>
        </div>
      </div>
    `;
  }

  _closeOutside() {
    this._closeDialog();
  }

  _closeDialog() {
    this.dispatchEvent(
      new CustomEvent('close-dialog', {bubbles: true, composed: true})
    );
  }
}

customElements.define('employee-dialog', EmployeeDialog);
