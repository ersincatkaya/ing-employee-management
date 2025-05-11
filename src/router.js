import {Router} from '@vaadin/router';
import '../src/components/app-wrapper.js';
import '../src/components/employee-dialog.js';
import '../src/components/not-found.js';

export function initRouter(outlet) {
  const router = new Router(outlet);
  router.setRoutes([
    {
      path: '/',
      component: 'app-wrapper',
    },
    {
      path: '/add',
      component: 'employee-dialog',
    },
    {
      path: '(.*)',
      component: 'not-found-page',
    },
  ]);
}
