import {fixture, html, expect} from '@open-wc/testing';
import '../src/components/app-wrapper.js';

describe('app-wrapper', () => {
  it('should be defined', async () => {
    const el = await fixture(html`<app-wrapper></app-wrapper>`);
    expect(el).to.exist;
  });

  it('should render a header note', async () => {
    const el = await fixture(html`<app-wrapper></app-wrapper>`);
    const headerNote = el.shadowRoot.querySelector('.header-note');
    expect(headerNote).to.not.be.null;
    expect(headerNote.textContent).to.contain('Employee List');
  });

  it('should render employee-list component', async () => {
    const el = await fixture(html`<app-wrapper></app-wrapper>`);
    const list = el.shadowRoot.querySelector('employee-list');
    expect(list).to.not.be.null;
  });
});
