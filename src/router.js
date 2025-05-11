import {Router} from '@vaadin/router';

export function initRouter(outlet) {
  const router = new Router(outlet);

  router.setRoutes([
    {path: '/', redirect: '/list'},
    {path: '/list', component: 'app-wrapper'},
    {path: '/add', component: 'employee-dialog'},
    {path: '/edit/:id', component: 'employee-dialog'},
  ]);
}
