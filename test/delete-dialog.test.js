import {fixture, html, expect, oneEvent} from '@open-wc/testing';
import '../src/components/delete-dialog.js';

describe('delete-dialog', () => {
  const mockEmployee = {
    firstName: 'John',
    lastName: 'Doe',
  };

  it('should be defined', async () => {
    const el = await fixture(html`<delete-dialog></delete-dialog>`);
    expect(el).to.exist;
  });

  it('should render when open and employee are provided', async () => {
    const el = await fixture(
      html`<delete-dialog
        .open=${true}
        .employee=${mockEmployee}
      ></delete-dialog>`
    );
    const dialog = el.shadowRoot.querySelector('.dialog');
    expect(dialog).to.exist;
    expect(el.shadowRoot.textContent).to.include('John');
    expect(el.shadowRoot.textContent).to.include('Doe');
  });

  it('should emit cancel-delete event when cancel button is clicked', async () => {
    const el = await fixture(
      html`<delete-dialog
        .open=${true}
        .employee=${mockEmployee}
      ></delete-dialog>`
    );

    const cancelBtn = el.shadowRoot.querySelector('.cancel');
    setTimeout(() => cancelBtn.click());
    const e = await oneEvent(el, 'cancel-delete');
    expect(e).to.exist;
  });

  it('should emit confirm-delete event with employee detail on confirm', async () => {
    const el = await fixture(
      html`<delete-dialog
        .open=${true}
        .employee=${mockEmployee}
      ></delete-dialog>`
    );

    const confirmBtn = el.shadowRoot.querySelector('.proceed');
    setTimeout(() => confirmBtn.click());
    const e = await oneEvent(el, 'confirm-delete');
    expect(e).to.exist;
    expect(e.detail).to.deep.equal(mockEmployee);
  });
});
