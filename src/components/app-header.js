import {LitElement, html, css} from 'lit';

export class AppHeader extends LitElement {
  static styles = css`
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background-color: #f8f8f8;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo img {
      height: 32px;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .action {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #f56600;
      font-weight: 500;
      cursor: pointer;
    }

    .action:hover {
      opacity: 0.8;
    }

    .flag {
      width: 24px;
      height: 16px;
      cursor: pointer;
    }
  `;

  render() {
    return html`
      <header>
        <div class="logo">
          <img src="/public/assets/ing.jpg" alt="Logo" />
          <strong>ING</strong>
        </div>
        <div class="actions">
          <div class="action">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f56600"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Employees</span>
          </div>
          <div class="action" @click=${this._openDialog}>
            <span>+</span>
            <span>Add New</span>
          </div>
          <img class="flag" src="/public/assets/tr-flag.png" alt="TR" />
          <img class="flag" src="/public/assets/en-flag.png" alt="EN" />
        </div>
      </header>
    `;
  }

  _openDialog() {
    window.dispatchEvent(new CustomEvent('open-employee-dialog'));
  }
}

customElements.define('app-header', AppHeader);
