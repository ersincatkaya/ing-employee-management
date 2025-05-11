import {LitElement, html, css} from 'lit';

export class NotFoundPage extends LitElement {
  static styles = css`
    .container {
      text-align: center;
      margin-top: 5rem;
      color: #f56600;
    }

    h1 {
      font-size: 48px;
    }

    p {
      font-size: 18px;
      color: #555;
    }

    a {
      color: #f56600;
      text-decoration: underline;
    }
  `;

  render() {
    return html`
      <div class="container">
        <h1>404</h1>
        <p>Page not found</p>
        <a href="/">Go back home</a>
      </div>
    `;
  }
}

customElements.define('not-found-page', NotFoundPage);
