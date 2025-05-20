import {Router} from '@vaadin/router';
import '../src/components/app-wrapper.js';
import '../src/components/employee-form.js';
import '../src/components/not-found.js';

export function initRouter(outlet) {
  const router = new Router(outlet);
  router.setRoutes([
    {path: '/', component: 'app-wrapper'},
    {path: '/add', component: 'employee-form'},
    {path: '/edit/:id', component: 'employee-form'},
    {path: '(.*)', component: 'not-found-page'},
  ]);
}
