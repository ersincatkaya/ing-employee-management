import {LitElement, html, css} from 'lit';
import './app-header.js';
import './employee-list.js';
import './employee-dialog.js';
import './delete-dialog.js';
import {EmployeeStore} from '../store/EmployeeStore.js';
import {labels} from '../i18n/labels.js';

export class AppWrapper extends LitElement {
  static properties = {
    title: {type: String},
    showDeleteDialog: {type: Boolean},
    employeeToDelete: {type: Object},
    employees: {type: Array},
    viewMode: {type: String},
    language: {type: String},
  };

  static styles = css`
    :host {
      display: block;
      background-color: #f8f8f8;
      border: 2px solid transparent;
    }

    :host(.confirming) {
      border-color: #007bff;
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
    }

    .content {
      width: 100%;
      padding: 0 24px;
    }
  `;

  constructor() {
    super();
    this.language = 'en';
    this.title = labels[this.language].listTitle + ' (Table View)';
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
    window.addEventListener('language-changed', this._onLanguageChange);
  }

  disconnectedCallback() {
    window.removeEventListener('request-delete', this._onRequestDelete);
    window.removeEventListener('delete-employee-final', this._onDeleteFinal);
    window.removeEventListener('toggle-view-mode', this._onToggleView);
    window.removeEventListener('language-changed', this._onLanguageChange);
    super.disconnectedCallback();
  }

  _onLanguageChange = (e) => {
    this.language = e.detail;
    this._updateTitle();
  };

  _onRequestDelete = (e) => {
    this.employeeToDelete = e.detail;
    this.showDeleteDialog = true;
    this.title = this.language === 'tr' ? 'Silme Onayı' : 'Delete Confirmation';
    this.classList.add('confirming');
  };

  _closeDeleteDialog = () => {
    this._updateTitle();
    this.showDeleteDialog = false;
    this.employeeToDelete = null;
    this.classList.remove('confirming');
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
    this._updateTitle();
  };

  _updateTitle() {
    const t = labels[this.language] || labels.en;
    this.title = `${t.listTitle} (${
      this.viewMode === 'grid' ? t.gridView : t.tableView
    })`;
  }

  render() {
    return html`
      <div class="header-note">${this.title}</div>
      <app-header .language=${this.language}></app-header>
      <div class="wrapper">
        <div class="content">
          <employee-list
            .employees=${this.employees}
            .viewMode=${this.viewMode}
            .language=${this.language}
          ></employee-list>
        </div>
        <employee-dialog></employee-dialog>
        <delete-dialog
          .open=${this.showDeleteDialog}
          .employee=${this.employeeToDelete}
          .language=${this.language}
          @cancel-delete=${this._closeDeleteDialog}
          @confirm-delete=${this._deleteConfirmed}
        ></delete-dialog>
      </div>
    `;
  }
}

customElements.define('app-wrapper', AppWrapper);
