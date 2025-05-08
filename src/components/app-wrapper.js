import {LitElement, html, css} from 'lit';
import './app-header.js';
import './employee-list.js';
import './employee-dialog.js';
import './delete-dialog.js';

export class AppWrapper extends LitElement {
  static properties = {
    title: {type: String},
    showDelete: {type: Boolean},
    deleteTarget: {type: Object},
  };

  static styles = css`
    .wrapper {
      background-color: #f8f8f8;
      border: 2px solid transparent;
    }

    .wrapper.confirming {
      border-color: #007bff;
    }

    .header-note {
      font-size: 11px;
      color: #999;
      padding: 8px 16px;
      background-color: #f8f8f8;
    }
  `;

  constructor() {
    super();
    this.title = 'Employee List (Table View)';
    this.showDelete = false;
    this.deleteTarget = null;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('request-delete', this._onRequestDelete);
  }

  disconnectedCallback() {
    window.removeEventListener('request-delete', this._onRequestDelete);
    super.disconnectedCallback();
  }

  _onRequestDelete = (e) => {
    this.deleteTarget = e.detail;
    this.title = 'Delete Confirmation';
    this.showDelete = true;
  };

  _onDeleteDone = () => {
    this.title = 'Employee List (Table View)';
    this.showDelete = false;
    this.deleteTarget = null;
  };

  render() {
    return html`
      <div class="header-note">${this.title}</div>
      <div class="wrapper ${this.showDelete ? 'confirming' : ''}">
        <app-header></app-header>
        <employee-list></employee-list>
        <employee-dialog></employee-dialog>
      </div>
      ${this.showDelete
        ? html`<delete-dialog
            .employee=${this.deleteTarget}
            @confirm-delete=${this._onDeleteDone}
            @cancel-delete=${this._onDeleteDone}
          ></delete-dialog>`
        : ''}
    `;
  }
}

customElements.define('app-wrapper', AppWrapper);
