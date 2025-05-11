import {LitElement, html, css} from 'lit';
import {labels} from '../i18n/labels.js';
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
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      border-radius: 4px;
      border: 2px solid transparent;
    }

    .icon-btn.active {
      border-color: #f56600;
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

    .icon {
      width: 18px;
      height: 18px;
      stroke: #f60;
      stroke-width: 2;
      fill: none;
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

  _setView(mode) {
    this.dispatchEvent(
      new CustomEvent('toggle-view-mode', {
        detail: mode,
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
                    <svg class="icon" viewBox="0 0 24 24">
                      <path
                        d="M4 21h4l10.5-10.5a2.121 2.121 0 0 0-3-3L5 18v3z"
                      />
                    </svg>
                  </button>
                  <button class="icon-btn" @click=${() => this._delete(emp)}>
                    <svg class="icon" viewBox="0 0 24 24">
                      <path d="M3 6h18" />
                      <path d="M8 6v-1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
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
                  <svg class="icon" viewBox="0 0 24 24">
                    <path d="M4 21h4l10.5-10.5a2.121 2.121 0 0 0-3-3L5 18v3z" />
                  </svg>
                </button>
                <button class="icon-btn" @click=${() => this._delete(emp)}>
                  <svg class="icon" viewBox="0 0 24 24">
                    <path d="M3 6h18" />
                    <path d="M8 6v-1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
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
      <div class="toolbar">
        <button
          class="icon-btn ${this.viewMode === 'table' ? 'active' : ''}"
          @click=${() => this._setView('table')}
          title="Table View"
        >
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z" />
          </svg>
        </button>
        <button
          class="icon-btn ${this.viewMode === 'grid' ? 'active' : ''}"
          @click=${() => this._setView('grid')}
          title="Grid View"
        >
          <svg class="icon" viewBox="0 0 24 24">
            <rect x="3" y="3" width="6" height="6" />
            <rect x="15" y="3" width="6" height="6" />
            <rect x="15" y="15" width="6" height="6" />
            <rect x="3" y="15" width="6" height="6" />
          </svg>
        </button>
      </div>
      ${this.viewMode === 'table'
        ? this.renderTableView(t)
        : this.renderGridView(t)}
    `;
  }
}

customElements.define('employee-list', EmployeeList);
