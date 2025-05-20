import {fixture, html, expect} from '@open-wc/testing';
import sinon from 'sinon';
import '../src/components/employee-form.js';

describe('employee-form', function () {
  let mockEmployee;
  let originalLabels;

  before(() => {
    if (window.labels) {
      originalLabels = window.labels;
    }

    window.labels = {
      en: {
        firstName: 'First Name',
        lastName: 'Last Name',
        birthDate: 'Birth Date',
        employmentDate: 'Employment Date',
        phone: 'Phone',
        email: 'Email',
        department: 'Department',
        position: 'Position',
        cancel: 'Cancel',
        save: 'Save',
        update: 'Update',
        addTitle: 'Add Employee',
        editTitle: 'Edit Employee',
      },
      tr: {
        firstName: 'Ad',
        lastName: 'Soyad',
        birthDate: 'Doğum Tarihi',
        employmentDate: 'İşe Giriş Tarihi',
        phone: 'Telefon',
        email: 'E-posta',
        department: 'Departman',
        position: 'Pozisyon',
        cancel: 'İptal',
        save: 'Kaydet',
        update: 'Güncelle',
        addTitle: 'Çalışan Ekle',
        editTitle: 'Çalışan Düzenle',
      },
    };

    mockEmployee = {
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
  });

  after(() => {
    if (originalLabels) {
      window.labels = originalLabels;
    }
  });

  beforeEach(() => {
    if (!window.EmployeeStore) {
      window.EmployeeStore = {};
    }

    window.EmployeeStore.employees = [mockEmployee];
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should be defined', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    expect(el).to.be.instanceOf(customElements.get('employee-form'));
  });

  it('should have a form element', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    const form = el.shadowRoot.querySelector('form');
    expect(form).to.exist;
  });

  it('should have input fields for employee data', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    const inputs = el.shadowRoot.querySelectorAll('input');
    expect(inputs.length).to.be.at.least(6);

    const selects = el.shadowRoot.querySelectorAll('select');
    expect(selects.length).to.be.at.least(2);
  });

  it('should have save and cancel buttons', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    const buttons = el.shadowRoot.querySelectorAll('button');
    expect(buttons.length).to.be.at.least(2);

    const cancelButton = el.shadowRoot.querySelector('button.cancel');
    expect(cancelButton).to.exist;

    const primaryButton = el.shadowRoot.querySelector('button.primary');
    expect(primaryButton).to.exist;
  });

  it('should support language switching', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    expect(el.language).to.equal('en');

    el.language = 'tr';
    await el.updateComplete;

    expect(el.language).to.equal('tr');
  });

  it('should have validations on form fields', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    const requiredInputs = el.shadowRoot.querySelectorAll('input[required]');
    expect(requiredInputs.length).to.be.at.least(
      1,
      'Should have at least one required field'
    );

    const emailInput = el.shadowRoot.querySelector('input[type="email"]');
    expect(emailInput).to.exist;
    expect(emailInput.getAttribute('type')).to.equal('email');

    const phoneInput = el.shadowRoot.querySelector('input[type="tel"]');
    expect(phoneInput).to.exist;
  });

  it('should create a valid empty employee object', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    const emptyEmployee = el._createEmptyEmployee();

    expect(emptyEmployee).to.have.property('id');
    expect(emptyEmployee).to.have.property('firstName');
    expect(emptyEmployee).to.have.property('lastName');
    expect(emptyEmployee).to.have.property('dateOfBirth');
    expect(emptyEmployee).to.have.property('dateOfEmployment');
    expect(emptyEmployee).to.have.property('phone');
    expect(emptyEmployee).to.have.property('email');
    expect(emptyEmployee).to.have.property('department');
    expect(emptyEmployee).to.have.property('position');
  });
});
