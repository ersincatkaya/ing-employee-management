import {LitElement, html, css} from 'lit';
import {labels} from '../i18n/labels.js';

export class AppHeader extends LitElement {
  static properties = {
    language: {type: String},
  };

  constructor() {
    super();
    this.language = 'en';
  }

  static styles = css`
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0.5rem;
      background-color: white;
      margin: 0 1rem;
      flex-wrap: wrap;
      gap: 1rem;
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
      flex-wrap: wrap;
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
      border: 2px solid transparent;
    }

    .flag.active {
      border-color: #f56600;
    }

    @media (max-width: 480px) {
      header {
        flex-direction: column;
        align-items: flex-start;
      }

      .actions {
        justify-content: flex-start;
        gap: 12px;
      }

      .action {
        font-size: 14px;
      }
    }
  `;

  render() {
    const t = labels[this.language] || labels.en;

    return html`
      <header>
        <div class="logo">
          <img src="/assets/ing.jpg" alt="Logo" />
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
            <span>${t.employees}</span>
          </div>
          <div class="action" @click=${this._openDialog}>
            <span>+</span>
            <span>${t.addNew}</span>
          </div>
          <img
            class="flag ${this.language === 'en' ? 'active' : ''}"
            src="/assets/en-flag.png"
            alt="EN"
            @click=${() => this._setLanguage('en')}
          />
          <img
            class="flag ${this.language === 'tr' ? 'active' : ''}"
            src="/assets/tr-flag.png"
            alt="TR"
            @click=${() => this._setLanguage('tr')}
          />
        </div>
      </header>
    `;
  }

  _openDialog() {
    window.dispatchEvent(new CustomEvent('open-employee-dialog'));
  }

  _setLanguage(lang) {
    this.language = lang;
    window.dispatchEvent(new CustomEvent('language-changed', {detail: lang}));
  }
}

customElements.define('app-header', AppHeader);
