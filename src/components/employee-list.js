import {LitElement, html, css} from 'lit';
import {EmployeeStore} from '../store/EmployeeStore.js';
import {labels} from '../i18n/labels.js';

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

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
    }

    .card {
      background: white;
      padding: 16px;
      border-radius: 6px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    }

    .card h4 {
      margin: 0 0 6px;
      color: #333;
    }

    .card p {
      margin: 2px 0;
      font-size: 13px;
    }

    .card .actions {
      margin-top: 10px;
      justify-content: flex-end;
    }
  `;

  static properties = {
    employees: {type: Array},
    viewMode: {type: String},
    language: {type: String},
  };

  constructor() {
    super();
    this.employees = EmployeeStore.employees;
    this.viewMode = 'table';
    this.language = 'en';
    window.addEventListener('employee-updated', () => {
      this.employees = [...EmployeeStore.employees];
    });
    window.addEventListener('language-changed', (e) => {
      this.language = e.detail;
    });
  }

  _delete(emp) {
    this.dispatchEvent(
      new CustomEvent('request-delete', {
        detail: emp,
        bubbles: true,
        composed: true,
      })
    );
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

  _toggleView() {
    const newView = this.viewMode === 'table' ? 'grid' : 'table';
    this.dispatchEvent(
      new CustomEvent('toggle-view-mode', {
        detail: newView,
        bubbles: true,
        composed: true,
      })
    );
  }

  renderTableView(t) {
    return html`
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>${t.firstName}</th>
            <th>${t.lastName}</th>
            <th>${t.employmentDate}</th>
            <th>${t.birthDate}</th>
            <th>${t.phone}</th>
            <th>${t.email}</th>
            <th>${t.department}</th>
            <th>${t.position}</th>
            <th>${t.actions}</th>
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
                    ✏️
                  </button>
                  <button class="icon-btn" @click=${() => this._delete(emp)}>
                    🗑️
                  </button>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  renderGridView(t) {
    return html`
      <div class="grid">
        ${this.employees.map(
          (emp) => html`
            <div class="card">
              <h4>${emp.firstName} ${emp.lastName}</h4>
              <p>${t.phone}: ${emp.phone}</p>
              <p>${t.email}: ${emp.email}</p>
              <p>${t.birthDate}: ${emp.dateOfBirth}</p>
              <p>${t.employmentDate}: ${emp.dateOfEmployment}</p>
              <p>${emp.department} / ${emp.position}</p>
              <div class="actions">
                <button class="icon-btn" @click=${() => this._edit(emp)}>
                  ✏️
                </button>
                <button class="icon-btn" @click=${() => this._delete(emp)}>
                  🗑️
                </button>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  render() {
    const t = labels[this.language] || labels.en;
    return html`
      <h2>${t.listTitle}</h2>

      ${this.viewMode === 'table'
        ? this.renderTableView(t)
        : this.renderGridView(t)}
    `;
  }
}

customElements.define('employee-list', EmployeeList);
