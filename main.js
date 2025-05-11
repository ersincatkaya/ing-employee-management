import './src/components/app-wrapper.js';
import './src/components/employee-dialog.js';
import {initRouter} from './src/router.js';

const app = document.getElementById('app');
initRouter(app);
