import {LitElement, html, css} from 'lit';
import {EmployeeStore} from '../store/EmployeeStore.js';

export class EmployeeList extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 95%;
      margin: 2rem auto;
    }

    h2 {
      color: #ff6600;
      font-weight: 600;
      font-size: 20px;
      margin-bottom: 20px;
    }

    .toolbar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 6px;
      overflow: hidden;
    }

    th,
    td {
      padding: 12px 14px;
      text-align: left;
      border-bottom: 1px solid #eee;
      font-size: 14px;
    }

    th {
      color: #ff6600;
      font-weight: 500;
    }

    tr:hover {
      background-color: #fafafa;
    }

    .actions {
      display: flex;
      gap: 10px;
    }

    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
    }

    svg {
      width: 18px;
      height: 18px;
      stroke: #f60;
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

  _edit(emp) {
    this.dispatchEvent(
      new CustomEvent('edit-employee', {
        detail: emp,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <h2>Employee List</h2>

      <div class="toolbar">
        <!-- Placeholder for table/grid toggle buttons -->
        <button class="icon-btn">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
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
                <td><input type="checkbox" /></td>
                <td>${emp.firstName}</td>
                <td>${emp.lastName}</td>
                <td>${emp.dateOfEmployment}</td>
                <td>${emp.dateOfBirth}</td>
                <td>${emp.phone}</td>
                <td>${emp.email}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
                <td class="actions">
                  <button class="icon-btn" @click=${() => this._edit(emp)}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path
                        d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
                      />
                    </svg>
                  </button>
                  <button
                    class="icon-btn"
                    @click=${() =>
                      window.dispatchEvent(
                        new CustomEvent('request-delete', {
                          detail: emp,
                        })
                      )}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
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
