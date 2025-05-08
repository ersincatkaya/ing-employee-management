import './src/components/app-header.js';
import './src/components/employee-dialog.js';
import './src/components/employee-list.js';

document.getElementById('app').innerHTML = `
  <app-header></app-header>
  <employee-list></employee-list>
  <employee-dialog></employee-dialog>
`;
