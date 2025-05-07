import {LitElement, html, css} from 'lit';
import './employee-list.js';
import './dialogs/employee-dialog.js';

export class EmployeeDashboard extends LitElement {
  static styles = css`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
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
    dialogOpen: {type: Boolean},
  };

  constructor() {
    super();
    this.dialogOpen = false;
  }

  render() {
    return html`
      <div class="header">
        <h2>Employees</h2>
        <button @click=${() => (this.dialogOpen = true)}>➕ Add New</button>
      </div>

      <employee-list></employee-list>

      <employee-dialog
        .open=${this.dialogOpen}
        @dialog-closed=${() => (this.dialogOpen = false)}
      ></employee-dialog>
    `;
  }
}

customElements.define('employee-dashboard', EmployeeDashboard);
