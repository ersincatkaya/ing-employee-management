import {fixture, html, expect} from '@open-wc/testing';
import '../src/components/not-found.js';

describe('not-found-page', () => {
  it('should render 404 heading', async () => {
    const el = await fixture(html`<not-found-page></not-found-page>`);
    const h1 = el.shadowRoot.querySelector('h1');
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('404');
  });

  it('should render a message', async () => {
    const el = await fixture(html`<not-found-page></not-found-page>`);
    const p = el.shadowRoot.querySelector('p');
    expect(p).to.exist;
    expect(p.textContent.toLowerCase()).to.include('page not found');
  });

  it('should have a home link', async () => {
    const el = await fixture(html`<not-found-page></not-found-page>`);
    const link = el.shadowRoot.querySelector('a');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal('/');
    expect(link.textContent.toLowerCase()).to.include('home');
  });
});
