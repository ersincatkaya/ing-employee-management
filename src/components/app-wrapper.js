import {LitElement, html, css} from 'lit';
import './app-header.js';
import './employee-list.js';
import './employee-dialog.js';
import './delete-dialog.js';
import {EmployeeStore} from '../store/EmployeeStore.js';

export class AppWrapper extends LitElement {
  static properties = {
    title: {type: String},
    showDeleteDialog: {type: Boolean},
    employeeToDelete: {type: Object},
    employees: {type: Array},
    viewMode: {type: String},
  };

  static styles = css`
    :host {
      display: block;
      background-color: #f8f8f8;
    }

    .header-note {
      font-size: 11px;
      color: #999;
      padding: 8px 16px;
      background-color: #f8f8f8;
    }

    app-header {
      width: 100%;
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 2px solid transparent;
    }

    .wrapper.confirming {
      border-color: #007bff;
    }

    .content {
      width: 100%;
      padding: 0 24px;
    }
  `;

  constructor() {
    super();
    this.title = 'Employee List (Table View)';
    this.showDeleteDialog = false;
    this.employeeToDelete = null;
    this.employees = EmployeeStore.employees;
    this.viewMode = 'table';
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('request-delete', this._onRequestDelete);
    window.addEventListener('delete-employee-final', this._onDeleteFinal);
    window.addEventListener('toggle-view-mode', this._onToggleView);
  }

  disconnectedCallback() {
    window.removeEventListener('request-delete', this._onRequestDelete);
    window.removeEventListener('delete-employee-final', this._onDeleteFinal);
    window.removeEventListener('toggle-view-mode', this._onToggleView);
    super.disconnectedCallback();
  }

  _onRequestDelete = (e) => {
    this.employeeToDelete = e.detail;
    this.showDeleteDialog = true;
    this.title = 'Delete Confirmation';
  };

  _closeDeleteDialog = () => {
    this.title = 'Employee List (Table View)';
    this.showDeleteDialog = false;
    this.employeeToDelete = null;
  };

  _deleteConfirmed = (e) => {
    const id = e.detail.id;
    const event = new CustomEvent('delete-employee-final', {
      detail: id,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
    this._closeDeleteDialog();
  };

  _onDeleteFinal = (e) => {
    const id = e.detail;
    EmployeeStore.deleteEmployee(id);
    this.employees = [...EmployeeStore.employees];
  };

  _onToggleView = (e) => {
    this.viewMode = e.detail;
    this.title =
      this.viewMode === 'grid'
        ? 'Employee List (Grid View)'
        : 'Employee List (Table View)';
  };

  render() {
    return html`
      <div class="header-note">${this.title}</div>
      <app-header></app-header>
      <div class="wrapper ${this.showDeleteDialog ? 'confirming' : ''}">
        <div class="content">
          <employee-list
            .employees=${this.employees}
            .viewMode=${this.viewMode}
          ></employee-list>
        </div>
        <employee-dialog></employee-dialog>
        <delete-dialog
          .open=${this.showDeleteDialog}
          .employee=${this.employeeToDelete}
          @cancel-delete=${this._closeDeleteDialog}
          @confirm-delete=${this._deleteConfirmed}
        ></delete-dialog>
      </div>
    `;
  }
}

customElements.define('app-wrapper', AppWrapper);
