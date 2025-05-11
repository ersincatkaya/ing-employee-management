import {fixture, html, expect} from '@open-wc/testing';
import sinon from 'sinon';
import '../src/components/employee-form.js';

describe('employee-form', () => {
  const mockEmployee = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    dateOfEmployment: '2020-01-01',
    phone: '1234567890',
    email: 'john@example.com',
    department: 'Tech',
    position: 'Senior',
  };

  it('should render all fields with correct values', async () => {
    const el = await fixture(
      html`<employee-form .employee=${mockEmployee}></employee-form>`
    );

    const inputs = el.shadowRoot.querySelectorAll('input');
    const selects = el.shadowRoot.querySelectorAll('select');

    expect(inputs[0].value).to.equal('John');
    expect(inputs[1].value).to.equal('Doe');
    expect(inputs[2].value).to.equal('1990-01-01');
    expect(inputs[3].value).to.equal('2020-01-01');
    expect(inputs[4].value).to.equal('1234567890');
    expect(inputs[5].value).to.equal('john@example.com');

    expect(selects[0].value).to.equal('Tech');
    expect(selects[1].value).to.equal('Senior');
  });

  it('should fire cancel-form event when cancel is clicked', async () => {
    const el = await fixture(
      html`<employee-form .employee=${mockEmployee}></employee-form>`
    );

    const cancelSpy = new Promise((resolve) => {
      el.addEventListener('cancel-form', () => resolve(true));
    });

    el.shadowRoot.querySelector('.cancel').click();

    const result = await cancelSpy;
    expect(result).to.be.true;
  });

  it('should fire submit-done event when form is submitted', async () => {
    const el = await fixture(
      html`<employee-form
        .employee=${{...mockEmployee, id: null}}
      ></employee-form>`
    );

    const submitSpy = new Promise((resolve) => {
      el.addEventListener('submit-done', () => resolve(true));
    });

    el.shadowRoot
      .querySelector('form')
      .dispatchEvent(new Event('submit', {cancelable: true, bubbles: true}));
    const result = await submitSpy;

    expect(result).to.be.true;
  });

  it('should prevent submission if email or phone is duplicate', async () => {
    const el = await fixture(
      html`<employee-form
        .employee=${{...mockEmployee, id: null}}
      ></employee-form>`
    );

    window.EmployeeStore = window.EmployeeStore || {};
    window.EmployeeStore.employees = [mockEmployee];

    const alertStub = sinon.stub(window, 'alert');

    el.shadowRoot
      .querySelector('form')
      .dispatchEvent(new Event('submit', {cancelable: true, bubbles: true}));

    expect(alertStub.calledOnce).to.be.true;
    alertStub.restore();
  });
});
