import {LitElement, html, css} from 'lit';
import {EmployeeStore} from '../store/EmployeeStore.js';

export class EmployeeForm extends LitElement {
  static styles = css`
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    }

    input,
    select,
    button {
      padding: 8px;
      font-size: 14px;
    }

    button {
      background-color: #007bff;
      color: white;
      border: none;
      cursor: pointer;
    }

    button:hover {
      background-color: #0056b3;
    }
  `;

  static properties = {
    employee: {type: Object},
  };

  constructor() {
    super();
    // Default empty employee form
    this.employee = {
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

  render() {
    return html`
      <h2>${this.employee.id ? 'Edit' : 'Add'} Employee</h2>
      <form @submit=${this._handleSubmit}>
        <input
          type="text"
          .value=${this.employee.firstName}
          placeholder="First Name"
          required
          @input=${(e) => (this.employee.firstName = e.target.value)}
        />
        <input
          type="text"
          .value=${this.employee.lastName}
          placeholder="Last Name"
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
          placeholder="Phone"
          required
          @input=${(e) => (this.employee.phone = e.target.value)}
        />
        <input
          type="email"
          .value=${this.employee.email}
          placeholder="Email"
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

        <button type="submit">
          ${this.employee.id ? 'Update' : 'Add'} Employee
        </button>
      </form>
    `;
  }

  // Handle form submission
  _handleSubmit(e) {
    e.preventDefault();

    // Check if the employee already exists (update)
    const exists = EmployeeStore.employees.some(
      (emp) => emp.id === this.employee.id
    );
    if (exists) {
      EmployeeStore.updateEmployee(this.employee);
    } else {
      EmployeeStore.addEmployee(this.employee);
    }

    // Optional: Reset form
    this.employee = {
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
    window.dispatchEvent(new CustomEvent('employee-updated'));
  }
}

customElements.define('employee-form', EmployeeForm);
