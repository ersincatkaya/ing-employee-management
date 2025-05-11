import {fixture, html, expect} from '@open-wc/testing';
import '../src/components/app-header.js';

describe('app-header', () => {
  it('renders with default language', async () => {
    const el = await fixture(html`<app-header></app-header>`);
    expect(el.language).to.equal('en');
  });

  it('updates language on flag click', async () => {
    const el = await fixture(html`<app-header></app-header>`);
    const trFlag = el.shadowRoot.querySelector('img[alt="TR"]');
    trFlag.click();
    expect(el.language).to.equal('tr');
  });
});
