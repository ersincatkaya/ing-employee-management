import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';
import {labels} from '../i18n/labels.js';
import {EmployeeStore} from '../store/EmployeeStore.js';

export class EmployeeForm extends LitElement {
  static styles = css`
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 100%;
    }

    label {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 2px;
    }

    input,
    select {
      padding: 8px;
      font-size: 14px;
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    button {
      padding: 8px 14px;
      font-size: 14px;
      border: none;
      cursor: pointer;
      border-radius: 4px;
    }

    .cancel {
      background-color: #e0e0e0;
      color: #333;
    }

    .primary {
      background-color: #ff6600;
      color: white;
    }

    @media (max-width: 768px) {
      form {
        padding: 0 1rem;
      }

      label {
        font-size: 13px;
      }

      input,
      select {
        font-size: 13px;
        padding: 6px;
      }
    }
  `;

  static properties = {
    employee: {type: Object},
    language: {type: String},
  };

  constructor() {
    super();
    this.employee = null;
    this.language = 'en';
    window.addEventListener('language-changed', (e) => {
      this.language = e.detail;
    });
  }

  connectedCallback() {
    super.connectedCallback();

    const match = window.location.pathname.match(/^\/edit\/(\d+)$/);
    if (match) {
      const id = Number(match[1]);
      const emp = EmployeeStore.employees.find((e) => e.id === id);
      if (emp) {
        this.employee = {...emp};
        return;
      }
    }

    this.employee = this._createEmptyEmployee();
  }

  render() {
    const t = labels[this.language] || labels.en;
    return html`
      <div style="padding: 0 2rem ">
        <h3>${this.employee?.id ? t.editTitle : t.addTitle}</h3>
        <form @submit=${this._handleSubmit}>
          <label>${t.firstName}</label>
          <input
            type="text"
            .value=${this.employee.firstName}
            required
            @input=${(e) => (this.employee.firstName = e.target.value)}
          />

          <label>${t.lastName}</label>
          <input
            type="text"
            .value=${this.employee.lastName}
            required
            @input=${(e) => (this.employee.lastName = e.target.value)}
          />

          <label>${t.birthDate}</label>
          <input
            type="date"
            .value=${this.employee.dateOfBirth}
            required
            @input=${(e) => (this.employee.dateOfBirth = e.target.value)}
          />

          <label>${t.employmentDate}</label>
          <input
            type="date"
            .value=${this.employee.dateOfEmployment}
            required
            @input=${(e) => (this.employee.dateOfEmployment = e.target.value)}
          />

          <label>${t.phone}</label>
          <input
            type="tel"
            .value=${this.employee.phone}
            required
            @input=${(e) => (this.employee.phone = e.target.value)}
          />

          <label>${t.email}</label>
          <input
            type="email"
            .value=${this.employee.email}
            required
            @input=${(e) => (this.employee.email = e.target.value)}
          />

          <label>${t.department}</label>
          <select
            .value=${this.employee.department}
            @change=${(e) => (this.employee.department = e.target.value)}
          >
            <option value="Analytics">Analytics</option>
            <option value="Tech">Tech</option>
          </select>

          <label>${t.position}</label>
          <select
            .value=${this.employee.position}
            @change=${(e) => (this.employee.position = e.target.value)}
          >
            <option value="Junior">Junior</option>
            <option value="Medior">Medior</option>
            <option value="Senior">Senior</option>
          </select>

          <div class="footer">
            <button type="button" class="cancel" @click=${this._cancel}>
              ${t.cancel}
            </button>
            <button type="submit" class="primary">
              ${this.employee?.id ? t.update : t.save}
            </button>
          </div>
        </form>
      </div>
    `;
  }

  _handleSubmit(e) {
    e.preventDefault();

    const isEdit = EmployeeStore.employees.some(
      (emp) => emp.id === this.employee.id
    );

    const duplicate = EmployeeStore.employees.some(
      (emp) =>
        emp.id !== this.employee.id &&
        (emp.email === this.employee.email || emp.phone === this.employee.phone)
    );

    if (duplicate) {
      alert('An employee with the same email or phone number already exists.');
      return;
    }

    if (isEdit) {
      EmployeeStore.updateEmployee(this.employee);
    } else {
      this.employee.id = Date.now();
      EmployeeStore.addEmployee(this.employee);
    }

    window.dispatchEvent(new CustomEvent('employee-updated'));
    Router.go('/');
  }

  _cancel() {
    Router.go('/');
  }

  _createEmptyEmployee() {
    return {
      id: null,
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      dateOfEmployment: '',
      phone: '',
      email: '',
      department: 'Analytics',
      position: 'Junior',
    };
  }
}

customElements.define('employee-form', EmployeeForm);
