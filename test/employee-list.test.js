import {fixture, html, expect} from '@open-wc/testing';
import '../src/components/employee-list.js';

describe('employee-list', () => {
  const mockEmployees = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2020-01-01',
      phone: '1234567890',
      email: 'john@example.com',
      department: 'Tech',
      position: 'Senior',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1992-02-02',
      dateOfEmployment: '2021-03-15',
      phone: '9876543210',
      email: 'jane@example.com',
      department: 'Analytics',
      position: 'Mid',
    },
  ];

  async function createEmployeeList(employees = []) {
    const el = await fixture(html`
      <employee-list .employees=${employees}></employee-list>
    `);
    await el.updateComplete;
    return el;
  }

  it('should render a table when there are no employees', async () => {
    const el = await createEmployeeList([]);
    const table = el.shadowRoot.querySelector('table');
    expect(table).to.exist;
    const tbody = el.shadowRoot.querySelector('tbody');
    expect(tbody).to.exist;
    expect(tbody.children.length).to.equal(0);
  });

  it('should render list items for each employee', async () => {
    const el = await createEmployeeList(mockEmployees);
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(mockEmployees.length);
    expect(rows[0].textContent).to.include('John');
    expect(rows[0].textContent).to.include('Doe');
    expect(rows[1].textContent).to.include('Jane');
    expect(rows[1].textContent).to.include('Smith');
  });

  it('should render the correct number of table columns', async () => {
    const el = await createEmployeeList(mockEmployees);
    const headers = el.shadowRoot.querySelectorAll('thead th');
    expect(headers.length).to.equal(9);
  });

  it('should dispatch request-delete event with correct data when delete button is clicked', async () => {
    const el = await createEmployeeList(mockEmployees);
    let timeoutId;
    const eventPromise = new Promise((resolve, reject) => {
      el.addEventListener('request-delete', (e) => {
        clearTimeout(timeoutId);
        resolve(e.detail);
      });
      timeoutId = setTimeout(() => {
        reject(new Error('Timed out waiting for request-delete event'));
      }, 1000);
    });
    const deleteButton = el.shadowRoot.querySelector(
      'tbody tr:first-child .icon-btn:nth-child(2)'
    );
    expect(deleteButton).to.exist;
    deleteButton.click();
    const eventDetail = await eventPromise;
    expect(eventDetail).to.deep.equal(mockEmployees[0]);
  });

  it('should filter employees based on search term', async () => {
    const el = await createEmployeeList(mockEmployees);
    let rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(2);
    el.searchTerm = 'Jane';
    await el.updateComplete;
    rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(1);
    expect(rows[0].textContent).to.include('Jane');
  });

  it('should debounce search input events', async function () {
    this.timeout(3000);
    const el = await createEmployeeList(mockEmployees);
    el.debounceDelay = 50;
    await el.updateComplete;
    const searchInput = el.shadowRoot.querySelector('input[type="text"]');
    expect(searchInput).to.exist;
    searchInput.value = 'Jane';
    searchInput.dispatchEvent(new Event('input'));
    expect(el.searchTerm).to.equal('');
    await new Promise((resolve) => setTimeout(resolve, el.debounceDelay * 2));
    expect(el.searchTerm).to.equal('Jane');
  });

  it('should toggle view mode when view buttons are clicked', async () => {
    const el = await createEmployeeList(mockEmployees);
    expect(el.viewMode).to.equal('table');
    expect(el.shadowRoot.querySelector('table')).to.exist;
    let timeoutId;
    const eventPromise = new Promise((resolve, reject) => {
      el.addEventListener('toggle-view-mode', (e) => {
        clearTimeout(timeoutId);
        resolve(e.detail);
      });
      timeoutId = setTimeout(() => {
        reject(new Error('Timed out waiting for toggle-view-mode event'));
      }, 1000);
    });
    const gridButton = el.shadowRoot.querySelector(
      '.toolbar .icon-btn:nth-child(2)'
    );
    expect(gridButton).to.exist;
    gridButton.click();
    const eventDetail = await eventPromise;
    expect(eventDetail).to.equal('grid');
  });

  it('should handle pagination correctly', async () => {
    const manyEmployees = Array(10)
      .fill()
      .map((_, i) => ({
        ...mockEmployees[0],
        id: i + 1,
        firstName: `Employee${i + 1}`,
      }));
    const el = await createEmployeeList(manyEmployees);
    el.pageSize = 5;
    await el.updateComplete;
    expect(el.currentPage).to.equal(1);
    let rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(5);
    expect(rows[0].textContent).to.include('Employee1');
    const nextButton = el.shadowRoot.querySelector(
      '.pagination button:last-child'
    );
    expect(nextButton).to.exist;
    nextButton.click();
    await el.updateComplete;
    expect(el.currentPage).to.equal(2);
    rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows[0].textContent).to.include('Employee6');
    const prevButton = el.shadowRoot.querySelector(
      '.pagination button:first-child'
    );
    expect(prevButton).to.exist;
    prevButton.click();
    await el.updateComplete;
    expect(el.currentPage).to.equal(1);
    rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows[0].textContent).to.include('Employee1');
  });
});
