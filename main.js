// Import component and store
import './src/components/employee-form.js';
import './src/components/employee-list.js';
import './src/store/EmployeeStore.js';

// Render form and list
document.getElementById('app').innerHTML = `
  <employee-form></employee-form>
  <hr />
  <employee-list></employee-list>
`;
