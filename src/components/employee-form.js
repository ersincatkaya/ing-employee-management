import {LitElement, html, css} from 'lit';
import {EmployeeStore} from '../store/EmployeeStore.js';
import {labels} from '../i18n/labels.js';

export class EmployeeForm extends LitElement {
  static styles = css`
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 100%;
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

  updated(changedProps) {
    if (changedProps.has('employee') && !this.employee) {
      this.employee = this._createEmptyEmployee();
    }
  }

  render() {
    const t = labels[this.language] || labels.en;
    return html`
      <form @submit=${this._handleSubmit}>
        <input
          type="text"
          .value=${this.employee.firstName}
          placeholder="${t.firstName}"
          required
          @input=${(e) => (this.employee.firstName = e.target.value)}
        />
        <input
          type="text"
          .value=${this.employee.lastName}
          placeholder="${t.lastName}"
          required
          @input=${(e) => (this.employee.lastName = e.target.value)}
        />
        <input
          type="date"
          .value=${this.employee.dateOfBirth}
          required
          @input=${(e) => (this.employee.dateOfBirth = e.target.value)}
        />
        <input
          type="date"
          .value=${this.employee.dateOfEmployment}
          required
          @input=${(e) => (this.employee.dateOfEmployment = e.target.value)}
        />
        <input
          type="tel"
          .value=${this.employee.phone}
          placeholder="${t.phone}"
          required
          @input=${(e) => (this.employee.phone = e.target.value)}
        />
        <input
          type="email"
          .value=${this.employee.email}
          placeholder="${t.email}"
          required
          @input=${(e) => (this.employee.email = e.target.value)}
        />

        <select
          .value=${this.employee.department}
          @change=${(e) => (this.employee.department = e.target.value)}
        >
          <option value="Analytics">Analytics</option>
          <option value="Tech">Tech</option>
        </select>

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
    `;
  }

  _handleSubmit(e) {
    e.preventDefault();

    const exists = EmployeeStore.employees.some(
      (emp) => emp.id === this.employee.id
    );
    if (exists) {
      EmployeeStore.updateEmployee(this.employee);
    } else {
      EmployeeStore.addEmployee(this.employee);
    }

    window.dispatchEvent(new CustomEvent('employee-updated'));
    this.dispatchEvent(
      new CustomEvent('submit-done', {bubbles: true, composed: true})
    );
  }

  _cancel() {
    this.dispatchEvent(
      new CustomEvent('cancel-form', {bubbles: true, composed: true})
    );
  }

  submitForm() {
    this.shadowRoot.querySelector('form').dispatchEvent(new Event('submit'));
  }

  _createEmptyEmployee() {
    return {
      id: Date.now(),
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
