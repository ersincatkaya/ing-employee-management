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
      flex-wrap: wrap;
    }

    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-btn.active {
      border: 2px solid #f56600;
      padding: 2px;
      border-radius: 4px;
    }

    .icon {
      width: 18px;
      height: 18px;
      stroke: #f56600;
      fill: #f56600;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 6px;
      overflow: auto;
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

    .pagination {
      margin-top: 16px;
      display: flex;
      justify-content: center;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }

    .pagination button {
      background: none;
      border: 1px solid #ff6600;
      color: #ff6600;
      padding: 8px 14px;
      font-size: 14px;
      border-radius: 4px;
      cursor: pointer;
    }

    .pagination button:disabled {
      opacity: 0.5;
      cursor: default;
    }

    @media (max-width: 768px) {
      .grid {
        grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
      }

      table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
        font-size: 12px;
      }

      th,
      td {
        padding: 6px;
      }

      h2 {
        font-size: 16px;
      }

      input[type='text'] {
        width: 100% !important;
        margin-top: 0.5rem;
      }
    }

    @media (max-width: 480px) {
      .card p {
        font-size: 12px;
      }

      .card h4 {
        font-size: 14px;
      }
    }
  `;

  static properties = {
    employees: {type: Array},
    viewMode: {type: String},
    language: {type: String},
    currentPage: {type: Number},
    pageSize: {type: Number},
    searchTerm: {type: String},
  };

  constructor() {
    super();
    this.employees = EmployeeStore.employees;
    this.viewMode = 'table';
    this.language = 'en';
    this.currentPage = 1;
    this.pageSize = 8;
    this.searchTerm = '';
    this._searchDebounceTimer = null;
    this.debounceDelay = 2000;

    window.addEventListener('employee-updated', () => {
      this.employees = [...EmployeeStore.employees];
    });
    window.addEventListener('language-changed', (e) => {
      this.language = e.detail;
    });
  }

  get paginatedEmployees() {
    const filtered = this.employees.filter((emp) => {
      const q = this.searchTerm.toLowerCase();
      return (
        emp.firstName.toLowerCase().includes(q) ||
        emp.lastName.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.position.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q)
      );
    });
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return filtered.slice(start, end);
  }

  get totalPages() {
    const filtered = this.employees.filter((emp) => {
      const q = this.searchTerm.toLowerCase();
      return (
        emp.firstName.toLowerCase().includes(q) ||
        emp.lastName.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.position.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q)
      );
    });
    return Math.ceil(filtered.length / this.pageSize);
  }

  _prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  _nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
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
          ${this.paginatedEmployees.map(
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
  _onSearch(e) {
    clearTimeout(this._searchDebounceTimer);
    const value = e.target.value;
    this._searchDebounceTimer = setTimeout(() => {
      this.searchTerm = value;
    }, this.debounceDelay);
  }

  renderGridView(t) {
    return html`
      <div class="grid">
        ${this.paginatedEmployees.map(
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
      <div
        style="display: flex; justify-content: flex-end; margin-bottom: 1rem;"
      >
        <input
          type="text"
          placeholder="${t.searchPlaceholder || 'Search...'}"
          @input=${this._onSearch}
          style="padding: 8px; width: 200px; border: 1px solid #ccc; border-radius: 4px;"
        />
      </div>
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

      <div class="pagination">
        <button ?disabled=${this.currentPage === 1} @click=${this._prevPage}>
          ‹
        </button>
        <span>${this.currentPage}</span>
        <button
          ?disabled=${this.currentPage >= this.totalPages}
          @click=${this._nextPage}
        >
          ›
        </button>
      </div>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
