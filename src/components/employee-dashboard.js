import {LitElement, html, css} from 'lit';
import './employee-list.js';
import './dialogs/employee-dialog.js';

export class EmployeeDashboard extends LitElement {
  static styles = css`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
    }

    h2 {
      margin: 0;
      font-size: 20px;
    }

    button {
      padding: 6px 12px;
      font-size: 14px;
      background-color: #007bff;
      border: none;
      color: white;
      cursor: pointer;
      border-radius: 4px;
    }

    button:hover {
      background-color: #0056b3;
    }
  `;

  static properties = {
    showDialog: {type: Boolean},
  };

  constructor() {
    super();
    this.showDialog = false;
  }

  render() {
    return html`
      <div class="header">
        <h2>Employees</h2>
        <button @click=${() => (this.showDialog = true)}>+ Add New</button>
      </div>

      <employee-list></employee-list>

      ${this.showDialog
        ? html`
            <employee-dialog
              @close-dialog=${this._handleDialogClose}
            ></employee-dialog>
          `
        : ''}
    `;
  }

  _handleDialogClose() {
    this.showDialog = false;
  }
}

customElements.define('employee-dashboard', EmployeeDashboard);
