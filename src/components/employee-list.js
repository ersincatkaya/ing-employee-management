import {LitElement, html, css} from 'lit';
import {EmployeeStore} from '../store/EmployeeStore.js';

export class EmployeeList extends LitElement {
  static styles = css`
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    th,
    td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
    }

    button {
      padding: 5px 10px;
      background-color: #dc3545;
      color: white;
      border: none;
      cursor: pointer;
    }

    button:hover {
      background-color: #c82333;
    }
  `;

  static properties = {
    employees: {type: Array},
  };

  constructor() {
    super();
    this.employees = [...EmployeeStore.employees];
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('employee-updated', this._refreshList);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('employee-updated', this._refreshList);
  }

  _refreshList = () => {
    this.employees = [...EmployeeStore.employees];
  };

  _deleteEmployee(id) {
    EmployeeStore.deleteEmployee(id);
    this._refreshList();
  }

  render() {
    if (this.employees.length === 0) {
      return html`<p>No employees found.</p>`;
    }

    return html`
      <h2>Employee List</h2>
      <table>
        <thead>
          <tr>
            <th>First</th>
            <th>Last</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Dept.</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.employees.map(
            (emp) => html`
              <tr>
                <td>${emp.firstName}</td>
                <td>${emp.lastName}</td>
                <td>${emp.email}</td>
                <td>${emp.phone}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
                <td>
                  <button @click=${() => this._deleteEmployee(emp.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
