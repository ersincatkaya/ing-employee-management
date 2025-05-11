import {fixture, html, expect} from '@open-wc/testing';
import '../src/components/employee-dialog.js';

describe('employee-dialog', () => {
  const mockEmployee = {
    id: 1,
    firstName: 'Jane',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    dateOfEmployment: '2020-01-01',
    phone: '1234567890',
    email: 'jane@example.com',
    department: 'Tech',
    position: 'Senior',
  };

  it('should not render anything if open is false and no employee', async () => {
    window.history.pushState({}, '', '/');
    const el = await fixture(html`<employee-dialog></employee-dialog>`);
    const overlay = el.shadowRoot.querySelector('.overlay');
    expect(overlay).to.be.null;
  });

  it('should render modal when open and employee are set', async () => {
    window.history.pushState({}, '', '/');
    const el = await fixture(html`<employee-dialog></employee-dialog>`);
    el.open = true;
    el.employee = mockEmployee;
    await el.updateComplete;

    const dialog = el.shadowRoot.querySelector('.dialog');
    expect(dialog).to.exist;
  });

  it('should dispatch close-dialog event when dialog is closed', async () => {
    window.history.pushState({}, '', '/');
    const el = await fixture(html`<employee-dialog></employee-dialog>`);
    el.open = true;
    el.employee = mockEmployee;
    await el.updateComplete;

    const overlay = el.shadowRoot.querySelector('.overlay');
    expect(overlay).to.exist;

    const spy = new Promise((resolve) => {
      el.addEventListener('close-dialog', () => resolve(true));
    });

    overlay.click();

    const result = await spy;
    expect(result).to.be.true;
  });
});
