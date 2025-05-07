import {LitElement, html, css} from 'lit';
import {EmployeeStore} from '../store/EmployeeStore.js';

export class EmployeeList extends LitElement {
  static styles = css`
    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      color: #f60;
    }

    .actions {
      display: flex;
      gap: 10px;
    }

    button {
      background: none;
      border: none;
      cursor: pointer;
      color: orange;
    }
  `;

  static properties = {
    employees: {type: Array},
  };

  constructor() {
    super();
    this.employees = EmployeeStore.employees;
    window.addEventListener('employee-updated', () => {
      this.employees = [...EmployeeStore.employees];
    });
  }

  _delete(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
      EmployeeStore.deleteEmployee(id);
      this.employees = [...EmployeeStore.employees];
    }
  }

  render() {
    return html`
      <h2>Employee List</h2>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Employment</th>
            <th>Date of Birth</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Department</th>
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
                <td>${emp.dateOfEmployment}</td>
                <td>${emp.dateOfBirth}</td>
                <td>${emp.phone}</td>
                <td>${emp.email}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
                <td class="actions">
                  <button @click=${() => this._edit(emp)}>✏️</button>
                  <button @click=${() => this._delete(emp.id)}>🗑️</button>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  _edit(emp) {
    void emp; // Just to avoid ESLint warning for now
    alert('Edit not implemented yet');
  }
}

customElements.define('employee-list', EmployeeList);
