import {LitElement, html, css} from 'lit';
import './employee-form.js';
import {EmployeeStore} from '../store/EmployeeStore.js';
import {labels} from '../i18n/labels.js';

export class EmployeeDialog extends LitElement {
  static properties = {
    open: {type: Boolean},
    employee: {type: Object},
    language: {type: String},
  };

  static styles = css`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .dialog {
      background: white;
      padding: 24px;
      border-radius: 8px;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .header h3 {
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
    }
  `;

  constructor() {
    super();
    this.open = false;
    this.employee = null;
    this.language = 'en';
    window.addEventListener('language-changed', (e) => {
      this.language = e.detail;
    });
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('open-employee-dialog', this._onAdd);
    window.addEventListener('edit-employee', this._onEdit);
  }

  disconnectedCallback() {
    window.removeEventListener('open-employee-dialog', this._onAdd);
    window.removeEventListener('edit-employee', this._onEdit);
    super.disconnectedCallback();
  }

  _onAdd = () => {
    this.employee = {
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
    this.open = true;
  };

  _onEdit = (e) => {
    const emp = e.detail;
    if (!emp.id) {
      emp.id = Date.now();
    }
    this.employee = {...emp};
    this.open = true;
  };

  _closeDialog() {
    this.open = false;
    this.employee = null;
    this.dispatchEvent(new CustomEvent('close-dialog'));
  }

  render() {
    if (!this.open) return html``;

    const t = labels[this.language] || labels.en;
    const isEdit =
      !!this.employee?.id &&
      EmployeeStore.employees.some((emp) => emp.id === this.employee.id);

    return html`
      <div class="overlay" @click=${this._closeDialog}>
        <div class="dialog" @click=${(e) => e.stopPropagation()}>
          <div class="header">
            <h3>${isEdit ? t.update : t.addNew}</h3>
            <button class="close-btn" @click=${this._closeDialog}>
              &times;
            </button>
          </div>
          <employee-form
            .employee=${this.employee}
            .mode=${isEdit ? 'edit' : 'add'}
            .language=${this.language}
            @submit-done=${this._closeDialog}
            @cancel-form=${this._closeDialog}
          ></employee-form>
        </div>
      </div>
    `;
  }
}

customElements.define('employee-dialog', EmployeeDialog);
