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
      background-color: #f4f4f4;
    }

    tr:nth-child(even) {
      background-color: #fafafa;
    }
  `;

  static properties = {
    employees: {type: Array},
  };

  constructor() {
    super();
    // Load from store and listen for changes
    this.employees = EmployeeStore.employees;
    EmployeeStore.loadFromStorage();
  }

  connectedCallback() {
    super.connectedCallback();
    // Re-render on store update (basic reactive setup)
    this._interval = setInterval(() => {
      this.employees = [...EmployeeStore.employees];
    }, 500);
  }

  disconnectedCallback() {
    clearInterval(this._interval);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <h2>Employee List</h2>
      ${this.employees.length === 0
        ? html`<p>No employees found.</p>`
        : html`
            <table>
              <thead>
                <tr>
                  <th>First</th>
                  <th>Last</th>
                  <th>Birth</th>
                  <th>Employment</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                ${this.employees.map(
                  (emp) => html`
                    <tr>
                      <td>${emp.firstName}</td>
                      <td>${emp.lastName}</td>
                      <td>${emp.dateOfBirth}</td>
                      <td>${emp.dateOfEmployment}</td>
                      <td>${emp.phone}</td>
                      <td>${emp.email}</td>
                      <td>${emp.department}</td>
                      <td>${emp.position}</td>
                    </tr>
                  `
                )}
              </tbody>
            </table>
          `}
    `;
  }
}

customElements.define('employee-list', EmployeeList);
